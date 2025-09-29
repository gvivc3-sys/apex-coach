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
        <div className="apex-app" style={{ background: '#0a0a0a', minHeight: '100vh' }}>
            <Header user={user} showProfile={showProfile} setShowProfile={setShowProfile} />

            {/* Secondary Navigation */}
            <div style={{
                marginTop: '100px',
                padding: '0 5%',
                display: 'flex',
                justifyContent: 'center'
            }}>
                <div style={{
                    display: 'flex',
                    gap: '10px',
                    background: '#141414',
                    padding: '8px',
                    borderRadius: '30px',
                    border: '1px solid #2a2a2a'
                }}>
                    {['chat', 'tutorials', 'roadmap', 'glossary'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                background: activeTab === tab ? '#fff' : 'transparent',
                                color: activeTab === tab ? '#000' : '#999',
                                border: 'none',
                                padding: '10px 24px',
                                borderRadius: '22px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: activeTab === tab ? '600' : '400',
                                textTransform: 'capitalize',
                                transition: 'all 0.2s',
                                letterSpacing: '0.3px'
                            }}
                        >
                            {tab === 'chat' ? 'AI Coach' : tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content Area */}
            <div style={{
                maxWidth: '900px',
                margin: '40px auto',
                padding: '0 20px'
            }}>
                {activeTab === 'chat' && <AICoach />}

                {activeTab === 'tutorials' && (
                    <div style={{
                        background: '#141414',
                        borderRadius: '16px',
                        padding: '40px',
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
                        padding: '40px',
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
                        padding: '40px',
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

            {showProfile && (
                <UserProfile user={user} onClose={() => setShowProfile(false)} />
            )}
        </div>
    );
}

export default Dashboard;