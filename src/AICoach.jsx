import { useState } from 'react';
import { supabase } from './supabase';
import './App.css';

function AICoach() {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Ready to build your online empire? Ask me anything - from finding winning products to scaling past $10K/month. No fluff, just actionable strategies.' }
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

            const apiUrl = window.location.hostname === 'localhost'
                ? 'http://localhost:5173/api/chat'
                : `https://${window.location.hostname}/api/chat`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: newMessages.slice(-10),
                    userId: user?.id
                }),
            });

            const data = await response.json();

            if (data.choices && data.choices[0]) {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: data.choices[0].message.content
                }]);
            }
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Connection issue. Please try again.'
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
            background: '#141414',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid #2a2a2a'
        }}>
            <div style={{
                flex: 1,
                overflow: 'auto',
                padding: '30px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
            }}>
                {messages.map((msg, i) => (
                    <div key={i} style={{
                        display: 'flex',
                        justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
                    }}>
                        <div style={{
                            maxWidth: '70%',
                            padding: '14px 18px',
                            background: msg.role === 'user' ? '#2a2a2a' : '#0a0a0a',
                            color: msg.role === 'user' ? '#ccc' : '#fff',
                            borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                            fontSize: '15px',
                            lineHeight: '1.6',
                            border: '1px solid #2a2a2a'
                        }}>
                            {msg.role === 'assistant' && (
                                <div style={{ fontSize: '11px', color: '#666', marginBottom: '8px', letterSpacing: '0.5px' }}>
                                    APEX COACH
                                </div>
                            )}
                            {msg.content}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <div style={{
                            padding: '14px 18px',
                            background: '#0a0a0a',
                            borderRadius: '18px 18px 18px 4px',
                            border: '1px solid #2a2a2a'
                        }}>
                            <div style={{ fontSize: '11px', color: '#666', marginBottom: '8px', letterSpacing: '0.5px' }}>
                                APEX COACH
                            </div>
                            <span style={{ color: '#666' }}>Thinking...</span>
                        </div>
                    </div>
                )}
            </div>

            <div style={{
                padding: '20px 30px',
                borderTop: '1px solid #2a2a2a',
                display: 'flex',
                gap: '12px',
                background: '#0a0a0a'
            }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !loading && sendMessage()}
                    placeholder="Ask about strategies, products, scaling..."
                    style={{
                        flex: 1,
                        padding: '14px 20px',
                        background: '#1a1a1a',
                        border: '1px solid #2a2a2a',
                        borderRadius: '24px',
                        fontSize: '15px',
                        outline: 'none',
                        color: '#fff',
                        transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#444'}
                    onBlur={(e) => e.target.style.borderColor = '#2a2a2a'}
                    disabled={loading}
                />
                <button
                    onClick={sendMessage}
                    disabled={loading}
                    style={{
                        padding: '14px 28px',
                        background: loading ? '#2a2a2a' : '#fff',
                        color: loading ? '#666' : '#000',
                        border: 'none',
                        borderRadius: '24px',
                        fontSize: '15px',
                        fontWeight: '600',
                        cursor: loading ? 'default' : 'pointer',
                        transition: 'all 0.2s'
                    }}
                >
                    Send
                </button>
            </div>
        </div>
    );
}

export default AICoach;