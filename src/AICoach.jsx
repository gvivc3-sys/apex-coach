import { useState, useEffect, useRef } from 'react';
import { supabase } from './supabase';
import ReactMarkdown from 'react-markdown';
import './AICoach.css';

function AICoach({ messages, setMessages, isMobile }) {
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingHistory, setLoadingHistory] = useState(true);
    const textareaRef = useRef(null);

    const scrollRef = useRef(null);
    const shouldStickRef = useRef(true);

    const scrollToBottom = (smooth = true) => {
        const el = scrollRef.current;
        if (!el) return;
        el.scrollTo({ top: el.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
    };

    const isNearBottom = () => {
        const el = scrollRef.current;
        if (!el) return true;
        const threshold = 80;
        return el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
    };

    const handleChange = (e) => {
        setInput(e.target.value);
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    };

    // 🆕 Load chat history on mount
    useEffect(() => {
        loadChatHistory();
    }, []);

    const loadChatHistory = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setLoadingHistory(false);
                return;
            }

            const { data, error } = await supabase
                .from('chat_messages')
                .select('role, content, created_at')
                .eq('user_id', user.id)
                .order('created_at', { ascending: true });

            if (error) throw error;

            if (data && data.length > 0) {
                setMessages(data.map(msg => ({
                    role: msg.role,
                    content: msg.content
                })));
            }
        } catch (error) {
            console.error('Error loading chat history:', error);
        } finally {
            setLoadingHistory(false);
            // Scroll to bottom after loading history
            setTimeout(() => scrollToBottom(false), 100);
        }
    };

    // 🆕 Save a message to Supabase
    const saveMessage = async (role, content) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) return;

            const { error } = await supabase
                .from('chat_messages')
                .insert([{
                    user_id: user.id,
                    role: role,
                    content: content
                }]);

            if (error) throw error;
        } catch (error) {
            console.error('Error saving message:', error);
        }
    };

    useEffect(() => {
        if (shouldStickRef.current) scrollToBottom(true);
    }, [messages]);

    useEffect(() => {
        if (loading && shouldStickRef.current) scrollToBottom(true);
    }, [loading]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        shouldStickRef.current = isNearBottom();

        const userMessage = { role: 'user', content: input };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setLoading(true);

        // 🆕 Save user message
        await saveMessage('user', input);

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

            shouldStickRef.current = isNearBottom();

            if (data.choices && data.choices[0]) {
                const assistantContent = data.choices[0].message.content;

                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: assistantContent
                }]);

                // 🆕 Save assistant message
                await saveMessage('assistant', assistantContent);
            }
        } catch (error) {
            console.error('Error:', error);
            shouldStickRef.current = isNearBottom();
            const errorContent = 'Connection issue. Please try again.';

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: errorContent
            }]);

            await saveMessage('assistant', errorContent);
        } finally {
            setLoading(false);
        }
    };

    const handleFocus = () => setTimeout(() => scrollToBottom(true), 250);

    // 🆕 Add clear chat function
    const clearChat = async () => {
        if (!window.confirm('Clear all chat history?')) return;

        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) return;

            const { error } = await supabase
                .from('chat_messages')
                .delete()
                .eq('user_id', user.id);

            if (error) throw error;

            setMessages([]);
        } catch (error) {
            console.error('Error clearing chat:', error);
        }
    };

    if (loadingHistory) {
        return (
            <div className={`ai-coach ${isMobile ? 'is-mobile' : ''}`}>
                <div className="ai-coach__scroll">
                    <div className="msg-row align-start">
                        <div className="bubble from-assistant">
                            <span className="muted">Loading chat history...</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`ai-coach ${isMobile ? 'is-mobile' : ''}`}>
            <div className="ai-coach__scroll" ref={scrollRef}>
                {messages.length === 0 && (
                    <div className="msg-row align-start">
                        <div className="bubble from-assistant">
                            <div className="assistant-label">APEX COACH</div>
                            Hey! Ready to make money online? Ask me anything about dropshipping, affiliate marketing, or flipping.
                        </div>
                    </div>
                )}

                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`msg-row ${msg.role === 'user' ? 'align-end' : 'align-start'}`}
                    >
                        <div className={`bubble ${msg.role === 'user' ? 'from-user' : 'from-assistant'}`}>
                            {msg.role === 'assistant' && (
                                <div className="assistant-label">APEX COACH</div>
                            )}
                            {msg.role === 'assistant' ? (
                                <ReactMarkdown
                                    components={{
                                        a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />
                                    }}
                                >
                                    {msg.content}
                                </ReactMarkdown>
                            ) : (
                                msg.content
                            )}
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
                {messages.length > 0 && (
                    <button
                        onClick={clearChat}
                        className="composer__clearBtn"
                        title="Clear chat history"
                    >
                        🗑️
                    </button>
                )}
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey && !loading) {
                            e.preventDefault();
                            sendMessage();
                        }
                    }}
                    placeholder={isMobile ? 'Ask…' : 'Ask about strategies, products, scaling…'}
                    className="composer__input"
                    rows={1}
                    style={{ overflowY: 'hidden', resize: 'none' }}
                    disabled={loading}
                />
                <button onClick={sendMessage} disabled={loading} className="composer__sendBtn">
                    Send
                </button>
            </div>
        </div>
    );
}

export default AICoach;