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

    useEffect(() => {
        checkOnboarding();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
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
        <div className="apex-app" style={{
            background: '#0a0a0a',
            minHeight: '100vh',
            fontFamily: '"Inter", sans-serif',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Header user={user} showProfile={showProfile} setShowProfile={setShowProfile} />

            {/* Secondary Navigation - Better Mobile Responsive */}
            <div style={{
                marginTop: '100px',
                padding: isMobile ? '0 10px' : '0 20px',
                display: 'flex',
                justifyContent: 'center'
            }}>
                <div style={{
                    display: 'inline-flex',
                    gap: isMobile ? '3px' : '6px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: isMobile ? '4px' : '6px',
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
                                background: activeTab === tab.id
                                    ? 'rgba(255, 255, 255, 0.95)'
                                    : 'transparent',
                                color: activeTab === tab.id ? '#000' : 'rgba(255, 255, 255, 0.7)',
                                border: 'none',
                                padding: isMobile ? '8px 12px' : '12px 24px',
                                borderRadius: '34px',
                                cursor: 'pointer',
                                fontSize: isMobile ? '12px' : '14px',
                                fontWeight: activeTab === tab.id ? '600' : '400',
                                fontVariationSettings: activeTab === tab.id
                                    ? '"wght" 600'
                                    : '"wght" 400',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                letterSpacing: '-0.2px',
                                fontFamily: '"Inter", sans-serif',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {isMobile && tab.id === 'chat' ? 'Coach' : tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content Area */}
            <div style={{
                flex: 1,
                maxWidth: '900px',
                width: '100%',
                margin: isMobile ? '20px auto' : '40px auto',
                padding: isMobile ? '0 10px' : '0 20px'
            }}>
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
                        padding: isMobile ? '24px' : '40px',
                        border: '1px solid #2a2a2a'
                    }}>
                        <h2 style={{ marginBottom: '30px', color: '#fff' }}>Quick Start Tutorials</h2>
                        <div style={{ display: 'grid', gap: '20px' }}>
                            {[
                                { title: 'Dropshipping 101', time: '15 min', level: 'Beginner' },
                                { title: 'Facebook Marketplace Flipping', time: '10 min', level: 'Beginner' },
                                { title: 'Creating Digital Products', time: '20 min', level: 'Intermediate' },
                                { title: 'TikTok Affiliate Marketing', time: '25 min', level: 'Intermediate' }
                            ].map((tutorial, i) => (
                                <div key={i} style={{
                                    padding: '20px',
                                    background: '#0a0a0a',
                                    borderRadius: '12px',
                                    border: '1px solid #2a2a2a',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                    onMouseEnter={(e) => e.currentTarget.style.borderColor = '#444'}
                                    onMouseLeave={(e) => e.currentTarget.style.borderColor = '#2a2a2a'}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <h3 style={{ margin: '0 0 5px 0', fontSize: '16px', color: '#fff' }}>{tutorial.title}</h3>
                                            <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                                                {tutorial.time} • {tutorial.level}
                                            </p>
                                        </div>
                                        <span style={{ fontSize: '20px', color: '#666' }}>→</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'roadmap' && (
                    <div style={{
                        background: '#141414',
                        borderRadius: '16px',
                        padding: isMobile ? '24px' : '40px',
                        border: '1px solid #2a2a2a'
                    }}>
                        <h2 style={{ marginBottom: '30px', color: '#fff' }}>Your $10K/Month Roadmap</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {[
                                { week: 'Week 1', goal: 'First $100', status: 'complete' },
                                { week: 'Week 2', goal: 'Scale to $500', status: 'current' },
                                { week: 'Week 3', goal: 'Hit $1,000', status: 'locked' },
                                { week: 'Week 4', goal: 'Optimize & Automate', status: 'locked' }
                            ].map((item, i) => (
                                <div key={i} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '20px'
                                }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        background: item.status === 'complete' ? '#22c55e' : item.status === 'current' ? '#fff' : '#2a2a2a',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: item.status === 'current' ? '#000' : '#fff',
                                        fontWeight: 'bold',
                                        border: item.status === 'locked' ? '1px solid #444' : 'none'
                                    }}>
                                        {item.status === 'complete' ? '✓' : i + 1}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ margin: '0 0 5px 0', fontSize: '16px', color: '#fff' }}>{item.week}</h3>
                                        <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>{item.goal}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'glossary' && (
                    <div style={{
                        background: '#141414',
                        borderRadius: '16px',
                        padding: isMobile ? '24px' : '40px',
                        border: '1px solid #2a2a2a'
                    }}>
                        <h2 style={{ marginBottom: '30px', color: '#fff' }}>Internet Money Glossary</h2>
                        <div style={{ display: 'grid', gap: '20px' }}>
                            {[
                                { term: 'Dropshipping', def: 'Selling products without holding inventory' },
                                { term: 'POD', def: 'Print on Demand - custom products printed per order' },
                                { term: 'Affiliate Marketing', def: 'Earning commissions by promoting products' },
                                { term: 'Digital Products', def: 'Downloadable products like templates, courses' },
                                { term: 'FBA', def: 'Fulfillment by Amazon - Amazon handles shipping for you' },
                                { term: 'Arbitrage', def: 'Buying low in one market, selling high in another' }
                            ].map((item, i) => (
                                <div key={i} style={{ borderBottom: '1px solid #2a2a2a', paddingBottom: '15px' }}>
                                    <h4 style={{ margin: '0 0 5px 0', fontSize: '16px', color: '#fff' }}>{item.term}</h4>
                                    <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>{item.def}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer style={{
                marginTop: '80px',
                padding: '40px 20px',
                background: '#141414',
                borderTop: '1px solid #2a2a2a'
            }}>
                <div style={{
                    maxWidth: '900px',
                    margin: '0 auto',
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    justifyContent: 'space-between',
                    gap: '30px'
                }}>
                    <div>
                        <h3 style={{
                            margin: '0 0 15px 0',
                            fontSize: '20px',
                            fontWeight: '700',
                            background: 'linear-gradient(45deg, #fff, #999)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}>
                            APEX
                        </h3>
                        <p style={{ margin: 0, fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
                            Your AI-powered path to internet money.<br />
                            No fluff. Just strategies that work.
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
                        <div>
                            <h4 style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                Resources
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <a href="#" style={{ color: '#666', textDecoration: 'none', fontSize: '14px' }}>Documentation</a>
                                <a href="#" style={{ color: '#666', textDecoration: 'none', fontSize: '14px' }}>Community</a>
                                <a href="#" style={{ color: '#666', textDecoration: 'none', fontSize: '14px' }}>Blog</a>
                            </div>
                        </div>

                        <div>
                            <h4 style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                Support
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <a href="#" style={{ color: '#666', textDecoration: 'none', fontSize: '14px' }}>Contact</a>
                                <a href="#" style={{ color: '#666', textDecoration: 'none', fontSize: '14px' }}>FAQ</a>
                                <a href="#" style={{ color: '#666', textDecoration: 'none', fontSize: '14px' }}>Terms</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{
                    maxWidth: '900px',
                    margin: '30px auto 0',
                    paddingTop: '20px',
                    borderTop: '1px solid #2a2a2a',
                    textAlign: 'center'
                }}>
                    <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
                        © 2025 APEX. Built for hustlers, by hustlers.
                    </p>
                </div>
            </footer>

            {showProfile && (
                <UserProfile user={user} onClose={() => setShowProfile(false)} />
            )}
        </div>
    );
}

export default Dashboard;