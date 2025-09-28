import { useState } from 'react';
import { supabase } from './supabase';
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
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                throw new Error('No user found');
            }

            const apiUrl = window.location.hostname === 'localhost'
                ? 'http://localhost:5173/api/chat'
                : `https://${window.location.hostname}/api/chat`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: newMessages.slice(-10),
                    userId: user.id
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.choices && data.choices[0]) {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: data.choices[0].message.content
                }]);
            }
        } catch (error) {
            console.error('Full error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: `Error: ${error.message}`
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            height: '500px',
            display: 'flex',
            flexDirection: 'column',
            background: '#0f0f0f',
            border: '1px solid #1a1a1a',
            marginTop: '30px',
            borderRadius: '0px'
        }}>
            <div style={{
                padding: '15px 20px',
                borderBottom: '1px solid #1a1a1a',
                background: '#0a0a0a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <div>
                    <h4 style={{ margin: 0, fontSize: '14px', letterSpacing: '1px' }}>APEX COACH</h4>
                    <p style={{ margin: '2px 0 0 0', fontSize: '10px', color: '#666', letterSpacing: '0.5px' }}>
                        AI STRATEGIST
                    </p>
                </div>
                <div style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%' }} />
            </div>

            <div style={{
                flex: 1,
                overflow: 'auto',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                background: '#0a0a0a'
            }}>
                {messages.map((msg, i) => (
                    <div key={i} style={{
                        padding: '12px 16px',
                        background: msg.role === 'user' ? '#1a1a1a' : '#0f0f0f',
                        border: '1px solid #2a2a2a',
                        marginLeft: msg.role === 'user' ? 'auto' : '0',
                        marginRight: msg.role === 'user' ? '0' : 'auto',
                        maxWidth: '75%',
                        fontSize: '14px',
                        lineHeight: '1.5',
                        color: msg.role === 'user' ? '#999' : '#fff',
                        borderRadius: '0px'
                    }}>
                        {msg.role === 'assistant' && (
                            <span style={{
                                fontSize: '10px',
                                color: '#666',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                display: 'block',
                                marginBottom: '8px'
                            }}>
                                APEX
                            </span>
                        )}
                        {msg.content}
                    </div>
                ))}
                {loading && (
                    <div style={{
                        color: '#666',
                        fontSize: '12px',
                        padding: '12px 16px',
                        background: '#0f0f0f',
                        border: '1px solid #2a2a2a',
                        maxWidth: '75%'
                    }}>
                        Analyzing...
                    </div>
                )}
            </div>

            <div style={{
                padding: '15px',
                borderTop: '1px solid #1a1a1a',
                display: 'flex',
                gap: '10px',
                background: '#0a0a0a'
            }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !loading && sendMessage()}
                    placeholder="Ask about strategies..."
                    style={{
                        flex: 1,
                        padding: '12px 16px',
                        background: '#0f0f0f',
                        border: '1px solid #2a2a2a',
                        color: 'white',
                        fontSize: '14px',
                        outline: 'none',
                        borderRadius: '0px'
                    }}
                    disabled={loading}
                />
                <button
                    onClick={sendMessage}
                    disabled={loading}
                    style={{
                        padding: '12px 24px',
                        background: loading ? '#1a1a1a' : '#fff',
                        color: loading ? '#666' : '#000',
                        border: 'none',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        letterSpacing: '1px',
                        cursor: loading ? 'default' : 'pointer',
                        borderRadius: '0px'
                    }}
                >
                    {loading ? 'WAIT' : 'SEND'}
                </button>
            </div>
        </div>
    );
}

export default AICoach;