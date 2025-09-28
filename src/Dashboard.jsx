import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import AICoach from './AICoach';
import UserProfile from './UserProfile';
import Onboarding from './Onboarding';
import './App.css';

function Dashboard({ user }) {
    const [showCoach, setShowCoach] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [hasPreferences, setHasPreferences] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkOnboarding();
    }, []);

    const checkOnboarding = async () => {
        try {
            const { data, error } = await supabase
                .from('user_preferences')
                .select('*')
                .eq('id', user.id)
                .single();

            setHasPreferences(!!data && !error);
        } catch (error) {
            setHasPreferences(false);
        } finally {
            setLoading(false);
        }
    };

    // Add this function
    const handleSignOut = async () => {
        await supabase.auth.signOut();
        window.location.href = '/';
    };

    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
    }

    if (!hasPreferences) {
        return <Onboarding user={user} onComplete={() => setHasPreferences(true)} />;
    }

    return (
        <div className="apex-app">
            <nav className="nav-fixed">
                <div className="nav-container">
                    <div className="logo">APEX COACH</div>
                    <div className="nav-links">
                        <button
                            onClick={() => setShowProfile(true)}
                            style={{
                                background: 'transparent',
                                border: '1px solid var(--border-gray)',
                                color: 'var(--text-white)',
                                padding: '8px 16px',
                                cursor: 'pointer',
                                marginRight: '10px'
                            }}
                        >
                            {user.email.split('@')[0]}
                        </button>
                        <button className="cta-button" onClick={handleSignOut}>
                            Sign Out
                        </button>
                    </div>
                </div>
            </nav>

            <section className="hero">
                <div className="hero-content">
                    <h1 className="hero-title">
                        WELCOME TO<br />
                        <span className="accent">YOUR DASHBOARD</span>
                    </h1>
                    <p className="hero-subtitle">
                        Your AI coach is ready. Let's make internet money.
                    </p>

                    <div style={{
                        background: 'var(--secondary-black)',
                        border: '1px solid var(--border-gray)',
                        padding: '40px',
                        marginTop: '40px',
                        maxWidth: '800px',
                        margin: '40px auto'
                    }}>
                        <h2 style={{ marginBottom: '30px' }}>Today's Tasks</h2>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li style={{ marginBottom: '20px', padding: '20px', background: 'var(--primary-black)', border: '1px solid var(--border-gray)' }}>
                                📱 Set up your first digital product on Gumroad
                            </li>
                            <li style={{ marginBottom: '20px', padding: '20px', background: 'var(--primary-black)', border: '1px solid var(--border-gray)' }}>
                                💰 Find 3 products to flip on Facebook Marketplace
                            </li>
                            <li style={{ marginBottom: '20px', padding: '20px', background: 'var(--primary-black)', border: '1px solid var(--border-gray)' }}>
                                🚀 Create your TikTok account for affiliate marketing
                            </li>
                        </ul>

                        <button
                            className="primary-button"
                            style={{ width: '100%', marginTop: '30px' }}
                            onClick={() => setShowCoach(!showCoach)}
                        >
                            {showCoach ? 'Hide' : 'Talk to Your'} AI Coach
                        </button>

                        {showCoach && <AICoach />}
                    </div>
                </div>
            </section>

            {showProfile && (
                <UserProfile user={user} onClose={() => setShowProfile(false)} />
            )}
        </div>
    );
}

export default Dashboard;