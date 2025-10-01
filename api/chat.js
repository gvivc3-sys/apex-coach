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

        const appContent = {
            tutorials: [
                { title: 'Dropshipping 101', topics: ['product research', 'supplier finding', 'store setup'], level: 'beginner' },
                { title: 'Facebook Marketplace Flipping', topics: ['finding deals', 'negotiation', 'listing optimization'], level: 'beginner' },
                { title: 'Creating Digital Products', topics: ['Notion templates', 'Canva designs', 'pricing strategy'], level: 'intermediate' },
                { title: 'TikTok Affiliate Marketing', topics: ['content creation', 'product selection', 'link placement'], level: 'intermediate' }
            ],
            roadmap: ['Week 1: First $100', 'Week 2: Scale to $500', 'Week 3: Hit $1,000', 'Week 4: Optimize & Automate'],
            features: ['AI Coach', 'Tutorials', 'Roadmap', 'Glossary', 'Goals Dashboard']
        };

        const systemPrompt = `You are APEX Coach, the AI assistant for the APEX platform.
  
              PLATFORM KNOWLEDGE:
              - Available Tutorials: ${appContent.tutorials.map(t => t.title).join(', ')}
              - User Journey: ${appContent.roadmap.join(' → ')}
              - Platform Features: ${appContent.features.join(', ')}
  
              IMPORTANT INSTRUCTIONS:
              - When users ask about learning topics, reference specific tutorials available in the Tutorials tab
              - Guide users through the roadmap stages based on their progress
              - Remind users to check the Glossary tab for term definitions
              - Suggest relevant tutorials based on their questions
              - Example: "Check out our 'Dropshipping 101' tutorial in the Tutorials tab for a step-by-step guide"
  
              Be specific about where they can find resources on the platform.`;

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
                                    Always end with a clear next step.

                                    FORMATTING INSTRUCTIONS:
                                    - Use **bold** for emphasis on key points
                                    - Use bullet points (- or *) for lists
                                    - Use markdown links: [text](url) for any resources
                                    - Use ## for section headers when appropriate
                                    - Keep responses scannable and well-structured`
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