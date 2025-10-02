import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Create admin client for updates
const supabaseAdmin = createClient(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { messages, userId } = req.body;

        // Check user's current usage using admin client
        const { data: usage, error: usageError } = await supabaseAdmin
            .from('user_usage')
            .select('*')
            .eq('user_id', userId)
            .order('period_start', { ascending: false })
            .single();

        console.log('Fetched usage:', usage);
        console.log('Usage error:', usageError);

        // If user has exceeded limit
        if (usage && usage.tokens_used >= usage.tokens_limit) {
            return res.status(429).json({
                error: 'Monthly token limit reached. Upgrade your plan or wait until next billing cycle.',
                tokensUsed: usage.tokens_used,
                tokensLimit: usage.tokens_limit
            });
        }

        let preferences = null;
        let tutorials = [];

        try {
            const { data } = await supabase
                .from('user_preferences')
                .select('goals, skill_level')
                .eq('id', userId)
                .single();
            preferences = data;
        } catch (err) {
            console.log('Could not fetch preferences:', err);
        }

        if (preferences?.goals) {
            try {
                const { data } = await supabase
                    .from('tutorials')
                    .select('title, slug, category, level, key_points')
                    .in('category', preferences.goals)
                    .order('level', { ascending: true });
                tutorials = data || [];
            } catch (err) {
                console.log('Could not fetch tutorials:', err);
            }
        }

        const tutorialContext = tutorials.length > 0
            ? `\n\nAVAILABLE TUTORIALS:\n${tutorials.map(t =>
                `- "${t.title}" (${t.level}) - Key points: ${t.key_points?.join(', ') || 'Core strategies included'}`
            ).join('\n')}\n\n**When referencing tutorials**: Say "Check out **${tutorials[0]?.title}** in the Tutorials tab" (use the exact tutorial title from the list above).`
            : '';

        const systemPrompt = `
You are APEX Coach, an elite internet money strategist with deep expertise in copywriting, ecommerce, info products, dropshipping, affiliate marketing and other online business models. Your job is to help the user achieve rapid, sustainable income growth.

Tone:
- Aggressive and direct. Push for immediate action.
- No fluff. Speak like a battle‑hardened mentor.

Formatting (Markdown):
- Use **bold** to emphasise crucial phrases, numbers or actions.
- Use bullet points (e.g. “-”) when outlining steps, strategies or lists.
- Use ## headings to structure longer replies into clear sections.
- When you reference supporting material, use Markdown links where possible, but **only link to official APEX resources or reputable data sources the user would expect**. Do not link to competitor guides or generic blog posts.

            Content guidelines:
            - Focus on: \${ preferences?.goals?.join(', ') || 'making money online'}.
    - Stay within the APEX environment: reference the user’s stated goals and the APEX methodology.Don’t mention other AI tutors or external courses unless explicitly asked.
- Be concise and actionable: provide concrete scripts, tactics and next steps the user can implement immediately.

    \${ tutorialContext }
`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...messages
                ],
                temperature: 0.8,
                max_tokens: 500,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('OpenAI error:', data);
            return res.status(500).json({ error: data.error?.message || 'OpenAI error' });
        }

        const tokensUsed = data.usage?.total_tokens || 0;
        console.log('Tokens used this request:', tokensUsed);
        console.log('Usage object exists?', !!usage);
        console.log('Usage id:', usage?.id);

        // Update token usage using admin client
        if (usage && tokensUsed > 0) {
            const { error: updateError } = await supabaseAdmin
                .from('user_usage')
                .update({
                    tokens_used: usage.tokens_used + tokensUsed
                })
                .eq('id', usage.id);

            if (updateError) {
                console.error('Failed to update token usage:', updateError);
            } else {
                console.log('Updated tokens_used to:', usage.tokens_used + tokensUsed);
            }
        }

        return res.status(200).json({
            ...data,
            usage_info: {
                tokensUsed: usage ? usage.tokens_used + tokensUsed : tokensUsed,
                tokensLimit: usage?.tokens_limit || 0,
                tier: usage?.subscription_tier || 'none'
            }
        });

    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ error: error.message });
    }
}