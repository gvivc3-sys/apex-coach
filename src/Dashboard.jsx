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
        <div className="apex-app" style={{ background: '#f8f9fa', minHeight: '100vh' }}>
            <Header user={user} showProfile={showProfile} setShowProfile={setShowProfile} />

            {/* Secondary Navigation */}
            <div style={{
                marginTop: '70px',
                background: 'white',
                borderBottom: '1px solid #e0e0e0',
                padding: '0 5%',
                position: 'sticky',
                top: '70px',
                zIndex: 100
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    display: 'flex',
                    gap: '40px'
                }}>
                    <button
                        onClick={() => setActiveTab('chat')}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            padding: '20px 0',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: activeTab === 'chat' ? '600' : '400',
                            color: activeTab === 'chat' ? '#000' : '#666',
                            borderBottom: activeTab === 'chat' ? '2px solid #000' : 'none',
                            marginBottom: '-1px'
                        }}
                    >
                        AI Coach
                    </button>
                    <button
                        onClick={() => setActiveTab('tutorials')}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            padding: '20px 0',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: activeTab === 'tutorials' ? '600' : '400',
                            color: activeTab === 'tutorials' ? '#000' : '#666',
                            borderBottom: activeTab === 'tutorials' ? '2px solid #000' : 'none',
                            marginBottom: '-1px'
                        }}
                    >
                        Tutorials
                    </button>
                    <button
                        onClick={() => setActiveTab('roadmap')}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            padding: '20px 0',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: activeTab === 'roadmap' ? '600' : '400',
                            color: activeTab === 'roadmap' ? '#000' : '#666',
                            borderBottom: activeTab === 'roadmap' ? '2px solid #000' : 'none',
                            marginBottom: '-1px'
                        }}
                    >
                        Roadmaps
                    </button>
                    <button
                        onClick={() => setActiveTab('glossary')}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            padding: '20px 0',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: activeTab === 'glossary' ? '600' : '400',
                            color: activeTab === 'glossary' ? '#000' : '#666',
                            borderBottom: activeTab === 'glossary' ? '2px solid #000' : 'none',
                            marginBottom: '-1px'
                        }}
                    >
                        Glossary
                    </button>
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
                        background: 'white',
                        borderRadius: '12px',
                        padding: '40px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}>
                        <h2 style={{ marginBottom: '30px' }}>Quick Start Tutorials</h2>
                        <div style={{ display: 'grid', gap: '20px' }}>
                            {[
                                { title: 'Dropshipping 101', time: '15 min', level: 'Beginner' },
                                { title: 'Facebook Marketplace Flipping', time: '10 min', level: 'Beginner' },
                                { title: 'Creating Digital Products', time: '20 min', level: 'Intermediate' },
                                { title: 'TikTok Affiliate Marketing', time: '25 min', level: 'Intermediate' }
                            ].map((tutorial, i) => (
                                <div key={i} style={{
                                    padding: '20px',
                                    background: '#f8f9fa',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    ':hover': { background: '#f0f0f0' }
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <h3 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>{tutorial.title}</h3>
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

            {showProfile && (
                <UserProfile user={user} onClose={() => setShowProfile(false)} />
            )}
        </div>
    );
}

export default Dashboard;