import { useState } from 'react';
import { supabase } from './supabase';
import './App.css';

function AICoach() {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hey! Ready to build your online business? Ask me anything - from finding your first product to scaling to $10K/month.' }
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
            background: 'white',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
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
                            padding: '12px 16px',
                            background: msg.role === 'user' ? '#000' : '#f0f0f0',
                            color: msg.role === 'user' ? 'white' : '#000',
                            borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                            fontSize: '15px',
                            lineHeight: '1.5'
                        }}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <div style={{
                            padding: '12px 16px',
                            background: '#f0f0f0',
                            borderRadius: '18px 18px 18px 4px',
                            fontSize: '15px'
                        }}>
                            <span style={{ animation: 'pulse 1.5s infinite' }}>...</span>
                        </div>
                    </div>
                )}
            </div>

            <div style={{
                padding: '20px 30px',
                borderTop: '1px solid #e0e0e0',
                display: 'flex',
                gap: '12px',
                background: '#f8f9fa'
            }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !loading && sendMessage()}
                    placeholder="Type your question..."
                    style={{
                        flex: 1,
                        padding: '12px 20px',
                        background: 'white',
                        border: '1px solid #e0e0e0',
                        borderRadius: '24px',
                        fontSize: '15px',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        ':focus': { borderColor: '#000' }
                    }}
                    disabled={loading}
                />
                <button
                    onClick={sendMessage}
                    disabled={loading}
                    style={{
                        padding: '12px 24px',
                        background: loading ? '#666' : '#000',
                        color: 'white',
                        border: 'none',
                        borderRadius: '24px',
                        fontSize: '15px',
                        fontWeight: '500',
                        cursor: loading ? 'default' : 'pointer',
                        transition: 'background 0.2s'
                    }}
                >
                    Send
                </button>
            </div>
        </div>
    );
}

export default AICoach;