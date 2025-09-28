import { useState } from 'react';
import './App.css';

function AICoach() {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Ready to make internet money? Ask me anything about online business, passive income, or getting your first $10K.' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setLoading(true);

        try {
            const apiUrl = window.location.hostname === 'localhost'
                ? '/api/chat'
                : 'https://apex-coach-sage.vercel.app/api/chat';

            const { data: { user } } = await supabase.auth.getUser();

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: newMessages.slice(-10),
                    userId: user.id  // Add this
                }),
            });

            const data = await response.json();

            if (data.choices && data.choices[0]) {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: data.choices[0].message.content
                }]);
            } else {
                throw new Error('Invalid response from AI');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Connection issue. Make sure you have an active subscription.'
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            height: '600px',
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--secondary-black)',
            border: '1px solid var(--border-gray)',
            margin: '20px 0'
        }}>
            <div style={{
                padding: '20px',
                borderBottom: '1px solid var(--border-gray)',
                background: 'linear-gradient(45deg, var(--accent-red), var(--accent-gold))'
            }}>
                <h3 style={{ margin: 0 }}>APEX AI Coach</h3>
                <p style={{ margin: '5px 0 0 0', fontSize: '12px', opacity: 0.9 }}>
                    Your 24/7 Internet Money Strategist
                </p>
            </div>

            <div style={{
                flex: 1,
                overflow: 'auto',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '15px'
            }}>
                {messages.map((msg, i) => (
                    <div key={i} style={{
                        padding: '15px',
                        background: msg.role === 'user'
                            ? 'linear-gradient(45deg, var(--accent-red), var(--accent-gold))'
                            : 'var(--primary-black)',
                        border: msg.role === 'assistant' ? '1px solid var(--border-gray)' : 'none',
                        marginLeft: msg.role === 'user' ? '20%' : '0',
                        marginRight: msg.role === 'user' ? '0' : '20%',
                        whiteSpace: 'pre-wrap'
                    }}>
                        {msg.content}
                    </div>
                ))}
                {loading && (
                    <div style={{ color: 'var(--text-gray)' }}>Coach is thinking...</div>
                )}
            </div>

            <div style={{
                padding: '20px',
                borderTop: '1px solid var(--border-gray)',
                display: 'flex',
                gap: '10px'
            }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !loading && sendMessage()}
                    placeholder="Ask about dropshipping, flipping, digital products..."
                    style={{
                        flex: 1,
                        padding: '15px',
                        background: 'var(--primary-black)',
                        border: '1px solid var(--border-gray)',
                        color: 'white',
                        fontSize: '14px'
                    }}
                    disabled={loading}
                />
                <button
                    onClick={sendMessage}
                    disabled={loading}
                    className="primary-button"
                >
                    {loading ? '...' : 'Send'}
                </button>
            </div>
        </div>
    );
}

export default AICoach;