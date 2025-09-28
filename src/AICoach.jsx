// Use the full URL for production
const apiUrl = process.env.NODE_ENV === 'production'
    ? 'https://apex-coach.vercel.app/api/chat'
    : '/api/chat';

const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: newMessages }),
});