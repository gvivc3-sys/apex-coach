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
    const [chatMessages, setChatMessages] = useState([]);
    const [userPreferences, setUserPreferences] = useState(null);
    const [usageInfo, setUsageInfo] = useState(null);
    const createInitialMessage = (goals) => {
        if (!goals || goals.length === 0) {
            return 'Ready to build your online empire? Ask me anything - from finding winning products to scaling past $10K/month. No fluff, just actionable strategies.';
        }

        const goalNames = {
            dropshipping: 'Dropshipping',
            affiliate: 'Affiliate Marketing',
            digital_products: 'Digital Products',
            flipping: 'Flipping',
            content: 'Content Creation',
            freelancing: 'Freelancing',
            amazon_fba: 'Amazon FBA',
            print_on_demand: 'Print on Demand'
        };

        const selectedGoals = goals.map(g => goalNames[g] || g);

        if (selectedGoals.length === 1) {
            return `I see you selected **${selectedGoals[0]}** in your survey. Would you like to talk about that? I can help you get started with specific strategies and next steps.`;
        } else if (selectedGoals.length === 2) {
            return `I see you selected **${selectedGoals[0]}** and **${selectedGoals[1]}** in your survey. Which one would you like to discuss first?`;
        } else {
            const lastGoal = selectedGoals.pop();
            const goalsText = selectedGoals.join(', ') + ', and ' + lastGoal;
            return `I see you selected **${goalsText}** in your survey. Which of these would you like to discuss first? I can help you prioritize based on your current situation.`;
        }
    };

    const [tutorials, setTutorials] = useState([]);
    const [allTutorials, setAllTutorials] = useState([]);
    const [showOnlyAligned, setShowOnlyAligned] = useState(false);

    useEffect(() => {
        if (hasPreferences) {
            fetchTutorials();
        }
    }, [hasPreferences]);

    useEffect(() => {
        if (chatMessages.length > 0) {
            fetchUsage();
        }
    }, [chatMessages]);

    const fetchTutorials = async () => {
        // Fetch ALL tutorials
        const { data } = await supabase
            .from('tutorials')
            .select('*')
            .order('level', { ascending: true });

        setAllTutorials(data || []);
        setTutorials(data || []);
    };

    const isAlignedWithGoals = (tutorialCategory) => {
        return userPreferences?.goals?.includes(tutorialCategory);
    };

    const displayedTutorials = showOnlyAligned
        ? tutorials.filter(t => isAlignedWithGoals(t.category))
        : tutorials;

    const checkOnboarding = async () => {
        try {
            const { data, error } = await supabase
                .from('user_preferences')
                .select('*')
                .eq('id', user.id)
                .single();

            if (data && !error) {
                setHasPreferences(true);
                setUserPreferences(data);

                // Always create fresh initial message based on current preferences
                const initialMessage = createInitialMessage(data.goals);
                setChatMessages([{ role: 'assistant', content: initialMessage }]);
            } else {
                setHasPreferences(false);
            }
        } catch (error) {
            setHasPreferences(false);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsage = async () => {
        try {
            console.log('Fetching usage for user:', user.id);
            const { data, error } = await supabase
                .from('user_usage')
                .select('*')
                .eq('user_id', user.id)
                .gte('period_end', new Date().toISOString())
                .single();

            console.log('Usage data:', data, 'Error:', error);

            if (data) {
                setUsageInfo(data);
            }
        } catch (error) {
            console.log('No usage data yet:', error);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        checkOnboarding();
        fetchUsage();
    }, []);

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
        <>
            {showProfile ? (
                <UserProfile
                    user={user}
                    onBack={() => setShowProfile(false)}
                />
            ) : (
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
                                <>
                                    <div>DEBUG: usageInfo exists? {usageInfo ? 'YES' : 'NO'}</div>
                                    {usageInfo ? (
                                        <div style={{
                                            padding: 'var(--space-md)',
                                            background: 'var(--color-card-bg)',
                                            border: '1px solid var(--color-border)',
                                            borderRadius: 'var(--radius-md)',
                                            marginBottom: 'var(--space-md)'
                                        }}>
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                marginBottom: 'var(--space-sm)',
                                                fontSize: '12px',
                                                color: 'var(--color-text-secondary)',
                                                textTransform: 'uppercase',
                                                letterSpacing: '1px'
                                            }}>
                                                <span>Token Usage</span>
                                                <span style={{ color: 'var(--color-text-primary)' }}>
                                                    {usageInfo.tokens_used?.toLocaleString() || 0} / {usageInfo.tokens_limit?.toLocaleString() || 0}
                                                </span>
                                            </div>
                                            <div style={{
                                                width: '100%',
                                                height: '6px',
                                                background: 'var(--color-bg)',
                                                borderRadius: 'var(--radius-sm)',
                                                overflow: 'hidden'
                                            }}>
                                                <div style={{
                                                    width: `${Math.min((usageInfo.tokens_used / usageInfo.tokens_limit) * 100, 100)}%`,
                                                    height: '100%',
                                                    background: 'linear-gradient(45deg, var(--color-accent-red), var(--color-accent-gold))',
                                                    transition: 'width 0.3s ease'
                                                }} />
                                            </div>
                                        </div>
                                    ) : (
                                        <div>DEBUG: No usage info available</div>
                                    )}
                                    <AICoach
                                        messages={chatMessages}
                                        setMessages={setChatMessages}
                                        isMobile={isMobile}
                                    />
                                </>
                            )}

                            {activeTab === 'tutorials' && (
                                <div className="contentCard">
                                    <div className="tutorials-header">
                                        <h2>Quick Start Tutorials</h2>
                                        <label className="filter-toggle">
                                            <input
                                                type="checkbox"
                                                checked={showOnlyAligned}
                                                onChange={(e) => setShowOnlyAligned(e.target.checked)}
                                            />
                                            Show only aligned with my goals
                                        </label>
                                    </div>

                                    {displayedTutorials.length > 0 ? (
                                        <div className="tutorialGrid">
                                            {displayedTutorials.map((tutorial, i) => {
                                                const isAligned = isAlignedWithGoals(tutorial.category);
                                                return (
                                                    <div
                                                        key={tutorial.id || i}
                                                        className={`tutorialCard ${isAligned ? 'aligned' : ''}`}
                                                    >
                                                        {isAligned && (
                                                            <div className="tutorialAlignedBadge">
                                                                ⭐ Aligned with your goals
                                                            </div>
                                                        )}
                                                        <h3 className="tutorialTitle">{tutorial.title}</h3>
                                                        <p className="tutorialMeta">
                                                            {tutorial.time_minutes} min • {tutorial.level}
                                                        </p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <p className="no-tutorials-message">
                                            {showOnlyAligned
                                                ? 'No tutorials match your selected goals yet.'
                                                : 'No tutorials available yet.'}
                                        </p>
                                    )}
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
                </div>
            )}
        </>
    );
}

export default Dashboard;