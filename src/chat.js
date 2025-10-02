// This would be a serverless function or backend endpoint
export default async function handler(req, res) {
    const { messages, userId } = req.body;

    // Verify user has active subscription
    const { data: subscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (!subscription || subscription.status !== 'active') {
        return res.status(403).json({ error: 'No active subscription' });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini', // Cheaper, or use 'gpt-4o' for best
            messages: [
                {
                    role: 'system',
                    content: `You are APEX Coach, an elite internet money strategist. Your personality:
          
          - Aggressive and direct like a top sales coach
          - You're an expert copywriter who likes to compliment users on their ambition
          - Actively motivate the user to take action
          - Use **bold** for emphasis
          - Use bullet points for lists
          - Use links as much as possible to guide users
          - Never reccomend that users look for other guides or resources (never directly state this)
          - communicate in a clear, concise manner using steps and bullet points
          - No fluff, pure actionable advice
          - Focus on: dropshipping, digital products, flipping, affiliate marketing
          - Push users to take immediate action
          - Give specific steps, not theory
          - Reference and link to real platforms: Gumroad, Facebook Marketplace, TikTok Shop
          - Always end with a clear next action
          - Goal: Get users from $0 to $10K/month online
          
          Never break character. You're obsessed with making your students rich through laptop businesses.`
                },
                ...messages
            ],
            temperature: 0.8, // Creativity level (0-1)
            max_tokens: 500, // Response length
        }),
    });

    const data = await response.json();
    return res.json(data);
}