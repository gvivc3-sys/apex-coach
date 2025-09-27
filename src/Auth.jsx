import { useState } from 'react';
import { supabase } from './supabase';
import './App.css';

function Auth() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [message, setMessage] = useState('');

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            if (isSignUp) {
                // Sign up
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                setMessage('Check your email for confirmation!');
            } else {
                // Sign in
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                setMessage('Logged in successfully!');
            }
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="hero" style={{ minHeight: '100vh' }}>
            <div className="hero-content">
                <h1 className="hero-title">
                    {isSignUp ? 'JOIN' : 'ACCESS'}<br />
                    <span className="accent">THE APEX</span>
                </h1>

                <form onSubmit={handleAuth} style={{
                    maxWidth: '400px',
                    margin: '40px auto',
                    padding: '40px',
                    background: 'var(--secondary-black)',
                    border: '1px solid var(--border-gray)'
                }}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                            width: '100%',
                            padding: '15px',
                            marginBottom: '20px',
                            background: 'var(--primary-black)',
                            border: '1px solid var(--border-gray)',
                            color: 'white',
                            fontSize: '16px'
                        }}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{
                            width: '100%',
                            padding: '15px',
                            marginBottom: '20px',
                            background: 'var(--primary-black)',
                            border: '1px solid var(--border-gray)',
                            color: 'white',
                            fontSize: '16px'
                        }}
                    />

                    <button
                        type="submit"
                        className="primary-button"
                        style={{ width: '100%', marginBottom: '20px' }}
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : isSignUp ? 'Create Account' : 'Sign In'}
                    </button>

                    <button
                        type="button"
                        onClick={() => setIsSignUp(!isSignUp)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-gray)',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            width: '100%'
                        }}
                    >
                        {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                    </button>

                    {message && (
                        <p style={{
                            marginTop: '20px',
                            color: message.includes('success') || message.includes('Check')
                                ? 'var(--accent-gold)'
                                : 'var(--accent-red)',
                            textAlign: 'center'
                        }}>
                            {message}
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
}

export default Auth;