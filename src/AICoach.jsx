import { useState } from 'react';
import { supabase } from './supabase';
import './App.css';
import './AICoach.module.css';

const sendMessage = async () => {
    if (!input.trim()) return;

    // Check usage limits first
    const { data: { user } } = await supabase.auth.getUser();

    // Get user's subscription tier
    const { data: subscription } = await supabase
        .from('subscriptions')
        .select('tier')
        .eq('user_id', user.id)
        .single();

    // Get current month's usage
    const currentMonth = new Date().toISOString().slice(0, 7);
    const { data: usage } = await supabase
        .from('usage_tracking')
        .select('message_count')
        .eq('user_id', user.id)
        .eq('month', currentMonth)
        .single();

    const limits = {
        starter: 50,
        hustler: 500,
        empire: 9999 // unlimited
    };

    const currentUsage = usage?.message_count || 0;
    const limit = limits[subscription?.tier || 'starter'];

    if (currentUsage >= limit) {
        setMessages(prev => [...prev, {
            role: 'assistant',
            content: `You've reached your monthly limit of ${limit} messages. Upgrade to ${subscription?.tier === 'starter' ? 'Hustler' : 'Empire Builder'} for more coaching!`
        }]);
        return;
    }

    // Update usage count
    await supabase
        .from('usage_tracking')
        .upsert({
            user_id: user.id,
            month: currentMonth,
            message_count: currentUsage + 1,
            updated_at: new Date()
        });

    // ... rest of your sendMessage code
};

function AICoach({ messages, setMessages, isMobile }) {
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
        <div className={`ai-coach ${isMobile ? 'is-mobile' : ''}`}>
            <div className="ai-coach__scroll">
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`msg-row ${msg.role === 'user' ? 'align-end' : 'align-start'}`}
                    >
                        <div className={`bubble ${msg.role === 'user' ? 'from-user' : 'from-assistant'}`}>
                            {msg.role === 'assistant' && (
                                <div className="assistant-label">APEX COACH</div>
                            )}
                            {msg.content}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="msg-row align-start">
                        <div className="bubble from-assistant">
                            <div className="assistant-label">APEX COACH</div>
                            <span className="muted">Thinking...</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="composer">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !loading && sendMessage()}
                    placeholder={isMobile ? 'Ask...' : 'Ask about strategies, products, scaling...'}
                    className="composer__input"
                    disabled={loading}
                />
                <button
                    onClick={sendMessage}
                    disabled={loading}
                    className="composer__sendBtn"
                >
                    Send
                </button>
            </div>
        </div>
    );
}

export default AICoach;
