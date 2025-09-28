export default async function handler(req, res) {
    // ... CORS headers ...

    const { messages, userId } = req.body;

    // Fetch user preferences and recent history
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(
        process.env.VITE_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_KEY // Need service key for server-side
    );

    // Get user preferences
    const { data: preferences } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('id', userId)
        .single();

    // Get last 10 messages for context
    const { data: history } = await supabase
        .from('chat_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

    // Save new message
    await supabase
        .from('chat_history')
        .insert({
            user_id: userId,
            message: messages[messages.length - 1].content,
            role: 'user'
        });

    const systemPrompt = `You are APEX Coach, an elite internet money strategist.
  
  USER PROFILE:
  - Skill Level: ${preferences?.skill_level || 'unknown'}
  - Goals: ${preferences?.goals?.join(', ') || 'general'}
  - Monthly Target: $${preferences?.monthly_target || '10000'}
  - Hours Available: ${preferences?.hours_available || 'unknown'} per week
  - Strengths: ${preferences?.strengths || 'unknown'}
  
  CONVERSATION HISTORY SUMMARY:
  ${history?.slice(0, 5).map(h => `${h.role}: ${h.message.substring(0, 100)}`).join('\n')}
  
  PERSONALITY:
  - Remember previous conversations and reference them
  - Personalize advice based on their skill level and goals
  - Track their progress and celebrate wins
  - Push them based on their available time
  - Focus on their selected interests
  
  Always be specific with platforms, tools, and dollar amounts.
  Reference their past messages when relevant.
  Adapt your aggression level to their experience.`;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...messages
                ],
                temperature: 0.8,
                max_tokens: 500,
            }),
        });

        const data = await response.json();

        // Save AI response
        if (data.choices?.[0]?.message) {
            await supabase
                .from('chat_history')
                .insert({
                    user_id: userId,
                    message: data.choices[0].message.content,
                    role: 'assistant'
                });
        }

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}