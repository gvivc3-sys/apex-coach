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
            // Get current user
            const { data: { user } } = await supabase.auth.getUser();

            // Call your backend API
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: newMessages.map(m => ({
                        role: m.role,
                        content: m.content
                    })),
                    userId: user.id
                }),
            });

            const data = await response.json();

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: data.choices[0].message.content
            }]);
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Connection issue. Try again or check your subscription status.'
            }]);
        } finally {
            setLoading(false);
        }
    };

    // ... rest of component
}