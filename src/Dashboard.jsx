import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import AICoach from './AICoach';
import UserProfile from './UserProfile';
import Header from './Header';
import Onboarding from './Onboarding';
import './App.css';

function Dashboard({ user }) {
    const [showProfile, setShowProfile] = useState(false);
    const [hasPreferences, setHasPreferences] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('chat');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [chatMessages, setChatMessages] = useState([
        { role: 'assistant', content: 'Ready to build your online empire? Ask me anything - from finding winning products to scaling past $10K/month. No fluff, just actionable strategies.' }
    ]);

    const tutorials = [
        { title: 'Dropshipping 101', time: '15 min', level: 'Beginner' },
        { title: 'Facebook Marketplace Flipping', time: '10 min', level: 'Beginner' },
        { title: 'Creating Digital Products', time: '20 min', level: 'Intermediate' },
        { title: 'TikTok Affiliate Marketing', time: '25 min', level: 'Intermediate' }
    ];

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

    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
    }

    if (!hasPreferences) {
        return <Onboarding user={user} onComplete={() => setHasPreferences(true)} />;
    }

    return (
        <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>
            <Header user={user} showProfile={showProfile} setShowProfile={setShowProfile} />

            <div style={{ marginTop: '100px', padding: '0 20px', display: 'flex', justifyContent: 'center' }}>
                <div style={{
                    display: 'inline-flex',
                    gap: '6px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '6px',
                    borderRadius: '40px',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                    {[
                        { id: 'chat', label: 'AI Coach' },
                        { id: 'tutorials', label: 'Tutorials' },
                        { id: 'roadmap', label: 'Roadmap' },
                        { id: 'glossary', label: 'Glossary' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                background: activeTab === tab.id ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
                                color: activeTab === tab.id ? '#000' : 'rgba(255, 255, 255, 0.7)',
                                border: 'none',
                                padding: '12px 24px',
                                borderRadius: '34px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: activeTab === tab.id ? '600' : '400',
                                transition: 'all 0.3s',
                                letterSpacing: '-0.2px'
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px' }}>
                {activeTab === 'chat' && (
                    <AICoach
                        messages={chatMessages}
                        setMessages={setChatMessages}
                        isMobile={isMobile}
                    />
                )}

                {activeTab === 'tutorials' && (
                    <div style={{
                        background: '#141414',
                        borderRadius: '16px',
                        padding: '40px',
                        border: '1px solid #2a2a2a'
                    }}>
                        <h2 style={{ color: '#fff' }}>Quick Start Tutorials</h2>
                        <div style={{ display: 'grid', gap: '20px' }}>
                            {tutorials.map((tutorial, i) => (
                                <div key={i} style={{
                                    padding: '20px',
                                    background: '#0a0a0a',
                                    borderRadius: '12px',
                                    border: '1px solid #2a2a2a',
                                    cursor: 'pointer'
                                }}>
                                    <h3 style={{ color: '#fff' }}>{tutorial.title}</h3>
                                    <p style={{ color: '#666' }}>{tutorial.time} • {tutorial.level}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {showProfile && (
                <UserProfile user={user} onClose={() => setShowProfile(false)} />
            )}
        </div>
    );
}

export default Dashboard;