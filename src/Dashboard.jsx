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
        <div className="dashboard-container">
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

                {activeTab === 'roadmap' && (
                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '40px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}>
                        <h2 style={{ marginBottom: '30px' }}>Your $10K/Month Roadmap</h2>
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
                                        background: item.status === 'complete' ? '#22c55e' : item.status === 'current' ? '#000' : '#e0e0e0',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontWeight: 'bold'
                                    }}>
                                        {item.status === 'complete' ? '✓' : i + 1}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>{item.week}</h3>
                                        <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>{item.goal}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'glossary' && (
                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '40px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}>
                        <h2 style={{ marginBottom: '30px' }}>Internet Money Glossary</h2>
                        <div style={{ display: 'grid', gap: '20px' }}>
                            {[
                                { term: 'Dropshipping', def: 'Selling products without holding inventory' },
                                { term: 'POD', def: 'Print on Demand - custom products printed per order' },
                                { term: 'Affiliate Marketing', def: 'Earning commissions by promoting products' },
                                { term: 'Digital Products', def: 'Downloadable products like templates, courses' }
                            ].map((item, i) => (
                                <div key={i} style={{ borderBottom: '1px solid #e0e0e0', paddingBottom: '15px' }}>
                                    <h4 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>{item.term}</h4>
                                    <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>{item.def}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>

            <footer className={`site-footer ${isMobile ? 'is-mobile' : ''}`}>
                <div className="footer__inner">
                    <div className="footer__brand">
                        <h3 className="footer__brandTitle">APEX</h3>
                        <p className="footer__brandText">
                            Your AI-powered path to internet money.<br />
                            No fluff. Just strategies that work.
                        </p>
                    </div>

                    <div className="footer__cols">
                        <div className="footer__col">
                            <h4 className="footer__heading">Resources</h4>
                            <div className="footer__list">
                                <a href="#" className="footer__link">Documentation</a>
                                <a href="#" className="footer__link">Community</a>
                                <a href="#" className="footer__link">Blog</a>
                            </div>
                        </div>

                        <div className="footer__col">
                            <h4 className="footer__heading">Support</h4>
                            <div className="footer__list">
                                <a href="#" className="footer__link">Contact</a>
                                <a href="#" className="footer__link">FAQ</a>
                                <a href="#" className="footer__link">Terms</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="footer__bottom">
                    <p className="footer__copyright">
                        © 2025 APEX. Built for hustlers, by hustlers.
                    </p>
                </div>
            </footer>
            );
}


            {showProfile && (
                <UserProfile user={user} onClose={() => setShowProfile(false)} />
            )}
        </div>
    );
}

export default Dashboard;