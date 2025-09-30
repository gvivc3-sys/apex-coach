import { useState } from 'react';
import { supabase } from './supabase';
import './App.css';

function AICoach({ messages, setMessages, isMobile }) {
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim() || loading) return;

        // optimistic UI
        const userMessage = { role: 'user', content: input };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setLoading(true);

        try {
            // 1) Get current user
            const { data: userData, error: userErr } = await supabase.auth.getUser();
            if (userErr) throw userErr;
            const user = userData?.user;

            // 2) Enforce limits (if logged in)
            const limits = {
                starter: 50,
                hustler: 500,
                empire: Infinity, // unlimited
            };

            let limit = limits.starter;
            let currentUsage = 0;

            if (user?.id) {
                // subscription tier
                const { data: subscription, error: subErr } = await supabase
                    .from('subscriptions')
                    .select('tier')
                    .eq('user_id', user.id)
                    .single();

                const tier = subscription?.tier || 'starter';
                limit = limits[tier] ?? limits.starter;

                // usage for this month
                const currentMonth = new Date().toISOString().slice(0, 7);
                const { data: usage, error: usageErr } = await supabase
                    .from('usage_tracking')
                    .select('message_count')
                    .eq('user_id', user.id)
                    .eq('month', currentMonth)
                    .single();

                if (usageErr && usageErr.code !== 'PGRST116') {
                    // ignore "row not found" (PGRST116), throw others
                    throw usageErr;
                }

                currentUsage = usage?.message_count || 0;

                if (currentUsage >= limit) {
                    setMessages(prev => [
                        ...prev,
                        {
                            role: 'assistant',
                            content: `You've reached your monthly limit of ${Number.isFinite(limit) ? limit : 'unlimited'} messages. ${tier === 'starter'
                                    ? 'Upgrade to Hustler or Empire for more coaching!'
                                    : 'Upgrade your plan for more coaching!'
                                }`,
                        },
                    ]);
                    return;
                }

                // increment usage
                await supabase.from('usage_tracking').upsert({
                    user_id: user.id,
                    month: currentMonth,
                    message_count: currentUsage + 1,
                    updated_at: new Date().toISOString(),
                });
            }

            // 3) Call your API route
            // Using a relative path avoids any `window` issues on SSR builds
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: newMessages.slice(-10),
                    userId: user?.id ?? null,
                }),
            });

            const data = await response.json();

            if (data?.choices?.[0]?.message?.content) {
                setMessages(prev => [
                    ...prev,
                    {
                        role: 'assistant',
                        content: data.choices[0].message.content,
                    },
                ]);
            } else {
                throw new Error('No response from model');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [
                ...prev,
                { role: 'assistant', content: 'Connection issue. Please try again.' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                height: isMobile ? 'calc(100vh - 250px)' : '600px',
                display: 'flex',
                flexDirection: 'column',
                background: '#141414',
                borderRadius: isMobile ? '12px' : '16px',
                overflow: 'hidden',
                border: '1px solid #2a2a2a',
            }}
        >
            <div
                style={{
                    flex: 1,
                    overflow: 'auto',
                    padding: isMobile ? '20px' : '30px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                }}
            >
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        style={{
                            display: 'flex',
                            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        }}
                    >
                        <div
                            style={{
                                maxWidth: isMobile ? '85%' : '70%',
                                padding: isMobile ? '12px 14px' : '14px 18px',
                                background: msg.role === 'user' ? '#2a2a2a' : '#0a0a0a',
                                color: msg.role === 'user' ? '#ccc' : '#fff',
                                borderRadius:
                                    msg.role === 'user'
                                        ? '18px 18px 4px 18px'
                                        : '18px 18px 18px 4px',
                                fontSize: isMobile ? '14px' : '15px',
                                lineHeight: '1.6',
                                border: '1px solid #2a2a2a',
                            }}
                        >
                            {msg.role === 'assistant' && (
                                <div
                                    style={{
                                        fontSize: '11px',
                                        color: '#666',
                                        marginBottom: '8px',
                                        letterSpacing: '0.5px',
                                    }}
                                >
                                    APEX COACH
                                </div>
                            )}
                            {msg.content}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <div
                            style={{
                                padding: isMobile ? '12px 14px' : '14px 18px',
                                background: '#0a0a0a',
                                borderRadius: '18px 18px 18px 4px',
                                border: '1px solid #2a2a2a',
                            }}
                        >
                            <div
                                style={{
                                    fontSize: '11px',
                                    color: '#666',
                                    marginBottom: '8px',
                                    letterSpacing: '0.5px',
                                }}
                            >
                                APEX COACH
                            </div>
                            <span style={{ color: '#666' }}>Thinking...</span>
                        </div>
                    </div>
                )}
            </div>

            <div
                style={{
                    padding: isMobile ? '15px' : '20px 30px',
                    borderTop: '1px solid #2a2a2a',
                    display: 'flex',
                    gap: isMobile ? '8px' : '12px',
                    background: '#0a0a0a',
                }}
            >
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !loading && sendMessage()}
                    placeholder={isMobile ? 'Ask...' : 'Ask about strategies, products, scaling...'}
                    style={{
                        flex: 1,
                        padding: isMobile ? '12px 16px' : '14px 20px',
                        background: '#1a1a1a',
                        border: '1px solid #2a2a2a',
                        borderRadius: '24px',
                        fontSize: isMobile ? '14px' : '15px',
                        outline: 'none',
                        color: '#fff',
                        transition: 'border-color 0.2s',
                    }}
                    onFocus={e => (e.target.style.borderColor = '#444')}
                    onBlur={e => (e.target.style.borderColor = '#2a2a2a')}
                    disabled={loading}
                />
                <button
                    onClick={sendMessage}
                    disabled={loading}
                    style={{
                        padding: isMobile ? '12px 20px' : '14px 28px',
                        background: loading ? '#2a2a2a' : '#fff',
                        color: loading ? '#666' : '#000',
                        border: 'none',
                        borderRadius: '24px',
                        fontSize: isMobile ? '14px' : '15px',
                        fontWeight: '600',
                        cursor: loading ? 'default' : 'pointer',
                        transition: 'all 0.2s',
                    }}
                >
                    Send
                </button>
            </div>
        </div>
    );
}

export default AICoach;
