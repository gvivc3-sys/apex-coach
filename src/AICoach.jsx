import { useState } from 'react';
import { supabase } from './supabase';
import styles from './AICoach.module.css';

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
        <div className={styles.chatContainer}>
            <div className={styles.chatMessages}>
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`${styles.chatMessage} ${msg.role === 'user'
                                ? styles.chatMessageUser
                                : styles.chatMessageAssistant
                            }`}
                    >
                        <div className={`${styles.chatBubble} ${msg.role === 'user'
                                ? styles.chatBubbleUser
                                : styles.chatBubbleAssistant
                            }`}>
                            {msg.role === 'assistant' && (
                                <div className={styles.assistantLabel}>
                                    APEX COACH
                                </div>
                            )}
                            {msg.content}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className={styles.chatLoading}>
                        <div className={styles.chatLoadingBubble}>
                            <div className={styles.assistantLabel}>APEX COACH</div>
                            <span className={styles.loadingDots}>Thinking...</span>
                        </div>
                    </div>
                )}
            </div>

            <div className={styles.chatInputContainer}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !loading && sendMessage()}
                    placeholder={isMobile ? "Ask..." : "Ask about strategies, products, scaling..."}
                    className={styles.chatInput}
                    disabled={loading}
                />
                <button
                    onClick={sendMessage}
                    disabled={loading}
                    className={styles.chatSendButton}
                >
                    Send
                </button>
            </div>
        </div>
    );
}

export default AICoach;
