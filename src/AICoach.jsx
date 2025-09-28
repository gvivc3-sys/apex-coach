const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
        // Get the current user
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            throw new Error('No user found');
        }

        // Use correct API URL
        const apiUrl = window.location.hostname === 'localhost'
            ? 'http://localhost:5173/api/chat'
            : `https://${window.location.hostname}/api/chat`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: newMessages.slice(-10),
                userId: user.id  // Pass the user ID
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
        } else if (data.error) {
            throw new Error(data.error);
        }
    } catch (error) {
        console.error('Full error:', error);
        setMessages(prev => [...prev, {
            role: 'assistant',
            content: `Error: ${error.message}. Please check your subscription or try again.`
        }]);
    } finally {
        setLoading(false);
    }
};