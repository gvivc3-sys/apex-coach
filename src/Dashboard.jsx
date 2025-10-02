import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import AICoach from './AICoach';
import UserProfile from './UserProfile';
import Header from './Header';
import Onboarding from './Onboarding';
import './App.css';

/**
 * Dashboard component
 *
 * This version of the dashboard uses the redesigned CSS tokens defined
 * in `redesign.css`. It preserves the original layout and logic but
 * updates the import and a few inline styles to tie into the new theme.
 */
function Dashboard({ user }) {
    const [showProfile, setShowProfile] = useState(false);
    const [hasPreferences, setHasPreferences] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('chat');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [chatMessages, setChatMessages] = useState([
        {
            role: 'assistant',
            content:
                'Ready to build your online empire? Ask me anything - from finding winning products to scaling past $10K/month. No fluff, just actionable strategies.'
        }
    ]);

    const tutorials = [
        { title: 'Dropshipping 101', time: '15 min', level: 'Beginner' },
        { title: 'Facebook Marketplace Flipping', time: '10 min', level: 'Beginner' },
        { title: 'Creating Digital Products', time: '20 min', level: 'Intermediate' },
        { title: 'TikTok Affiliate Marketing', time: '25 min', level: 'Intermediate' }
    ];

    useEffect(() => {
        window.scrollTo(0, 0);
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
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh'
                }}
            >
                Loading...
            </div>
        );
    }

    if (!hasPreferences) {
        return <Onboarding user={user} onComplete={() => setHasPreferences(true)} />;
    }

    return (
        <div className="dashboard-container">
            <Header user={user} showProfile={showProfile} setShowProfile={setShowProfile} />

            <div className="secondary-nav">
                <div className="navPillContainer">
                    {[
                        { id: 'chat', label: 'AI Coach' },
                        { id: 'tutorials', label: 'Tutorials' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`navPillButton${activeTab === tab.id ? ' navPillButtonActive' : ''}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>
            <div className="mainContent">
                {activeTab === 'chat' && (
                    <AICoach
                        messages={chatMessages}
                        setMessages={setChatMessages}
                        isMobile={isMobile}
                    />
                )}

                {activeTab === 'tutorials' && (
                    <div className="contentCard">
                        <h2>Quick Start Tutorials</h2>
                        <div className="tutorialGrid">
                            {tutorials.map((tutorial, i) => (
                                <div key={i} className="tutorialCard">
                                    <h3 className="tutorialTitle">{tutorial.title}</h3>
                                    <p className="tutorialMeta">
                                        {tutorial.time} • {tutorial.level}
                                    </p>
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
                                <a href="#" className="footer__link">
                                    Documentation
                                </a>
                                <a href="#" className="footer__link">
                                    Community
                                </a>
                                <a href="#" className="footer__link">
                                    Blog
                                </a>
                            </div>
                        </div>

                        <div className="footer__col">
                            <h4 className="footer__heading">Support</h4>
                            <div className="footer__list">
                                <a href="#" className="footer__link">
                                    Contact
                                </a>
                                <a href="#" className="footer__link">
                                    FAQ
                                </a>
                                <a href="#" className="footer__link">
                                    Terms
                                </a>
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
            {showProfile && (
                <UserProfile
                    user={user}
                    onClose={() => setShowProfile(false)}
                    onRetakeSurvey={() => {
                        setShowProfile(false);
                        // The user preferences were deleted in UserProfile.jsx,
                        // so when the component re-renders, it will trigger onboarding
                    }}
                />
            )}
        </div>
    );
}

export default Dashboard;