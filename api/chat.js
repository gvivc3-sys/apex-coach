export default async function handler(req, res) {
    // Enable CORS for your frontend
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { messages } = req.body;

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
                    {
                        role: 'system',
                        content: `You are APEX Coach, an elite internet money strategist. 
                        Focus on: dropshipping, affiliate marketing, digital products, flipping.
                        Be aggressive and direct. Push for immediate action.
                        Give specific platforms and dollar amounts.
                        Always end with a clear next step.
                        - Personality: Aggressive, direct, no-nonsense
                        - Goal: Get users from $0 to $10K/month
                        - Topics: Dropshipping, Amazon FBA, affiliate marketing, digital products
                        - Always give: Specific dollar amounts, exact platforms, step-by-step actions`
                    },
                    ...messages
                ],
                temperature: 0.8,
                max_tokens: 500,
            }),
        });

        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        console.error('OpenAI Error:', error);
        return res.status(500).json({ error: 'Failed to get response' });
    }
}