export default async function handler(req, res) {
    // Handle CORS
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
        const { messages } = req.body;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: `You are APEX Coach, an elite internet money strategist. 
            Focus on: dropshipping, affiliate marketing, digital products, flipping.
            Be aggressive and direct. Push for immediate action.
            Give specific platforms and dollar amounts.
            Always end with a clear next step.`
                    },
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

        return res.status(200).json(data);
    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ error: error.message });
    }
}