import { useState, useEffect, useRef } from 'react';
import { supabase } from './supabase';
import ReactMarkdown from 'react-markdown';
import './AICoach.css';

/* (You can keep your top-level sendMessage with usage limits here if you use it elsewhere) */

function AICoach({ messages, setMessages, isMobile }) {
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const textareaRef = useRef(null);

    // 🔽 smart auto-scroll bits
    const scrollRef = useRef(null);
    const shouldStickRef = useRef(true); // were we near bottom before the update?

    const scrollToBottom = (smooth = true) => {
        const el = scrollRef.current;
        if (!el) return;
        el.scrollTo({ top: el.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
    };

    const isNearBottom = () => {
        const el = scrollRef.current;
        if (!el) return true;
        const threshold = 80; // px
        return el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
    };

    const handleChange = (e) => {
        setInput(e.target.value);
        // Reset height to let scrollHeight shrink as well
        textareaRef.current.style.height = 'auto';
        // Set height to scrollHeight to fit content
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    };


    // on mount
    useEffect(() => {
        scrollToBottom(false);
    }, []);

    // when messages change, only autoscroll if we were near the bottom before the change
    useEffect(() => {
        if (shouldStickRef.current) scrollToBottom(true);
    }, [messages]);

    // when "Thinking..." appears/disappears
    useEffect(() => {
        if (loading && shouldStickRef.current) scrollToBottom(true);
    }, [loading]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        // capture whether we're at bottom before UI updates
        shouldStickRef.current = isNearBottom();

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

            // again, capture stickiness just before we append assistant reply
            shouldStickRef.current = isNearBottom();

            if (data.choices && data.choices[0]) {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: data.choices[0].message.content
                }]);
            }
        } catch (error) {
            console.error('Error:', error);
            shouldStickRef.current = isNearBottom();
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Connection issue. Please try again.'
            }]);
        } finally {
            setLoading(false);
        }
    };

    // helps keep input visible when mobile keyboard opens
    const handleFocus = () => setTimeout(() => scrollToBottom(true), 250);

    return (
        <div className={`ai-coach ${isMobile ? 'is-mobile' : ''}`}>
            <div className="ai-coach__scroll" ref={scrollRef}>
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`msg-row ${msg.role === 'user' ? 'align-end' : 'align-start'}`}
                    >
                        <div className={`bubble ${msg.role === 'user' ? 'from-user' : 'from-assistant'}`}>
                            {msg.role === 'assistant' && (
                                <div className="assistant-label">APEX COACH</div>
                            )}
                            {/* 👇 Use ReactMarkdown for assistant messages */}
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
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey && !loading) {
                            e.preventDefault(); // Prevent newline
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
