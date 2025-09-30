import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import AICoach from './AICoach';
import UserProfile from './UserProfile';
import Header from './Header';
import Onboarding from './Onboarding';
import styles from './Dashboard.module.css';
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

    // In Dashboard.jsx
    useEffect(() => {
        // Load chat from localStorage on mount
        const savedChat = localStorage.getItem(`apex_chat_${user.id}`);
        if (savedChat) {
            setChatMessages(JSON.parse(savedChat));
        } else {
            // Load from Supabase if not in localStorage
            loadChatHistory();
        }
    }, [user.id]);

    // Save to localStorage whenever messages change
    useEffect(() => {
        if (chatMessages.length > 1) { // Don't save just the initial message
            localStorage.setItem(`apex_chat_${user.id}`, JSON.stringify(chatMessages));
            // Also save to Supabase for long-term storage
            saveChatToSupabase();
        }
    }, [chatMessages]);

    const loadChatHistory = async () => {
        const { data } = await supabase
            .from('chat_history')
            .select('message, role')
            .eq('user_id', user.id)
            .order('created_at', { ascending: true })
            .limit(50); // Last 50 messages

        if (data && data.length > 0) {
            setChatMessages(data);
        }
    };

    const saveChatToSupabase = async () => {
        // Save last message to Supabase
        const lastMessage = chatMessages[chatMessages.length - 1];
        await supabase
            .from('chat_history')
            .insert({
                user_id: user.id,
                message: lastMessage.content,
                role: lastMessage.role
            });
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
        <div className={styles.dashboardContainer}>
            <Header user={user} showProfile={showProfile} setShowProfile={setShowProfile} />

            <div className={styles.secondaryNav}>
                <div className={styles.navPillContainer}>
                    {[
                        { id: 'chat', label: 'AI Coach' },
                        { id: 'tutorials', label: 'Tutorials' },
                        { id: 'roadmap', label: 'Roadmap' },
                        { id: 'glossary', label: 'Glossary' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`${styles.navPillButton} ${activeTab === tab.id ? styles.navPillButtonActive : ''
                                }`}
                        >
                            {isMobile && tab.id === 'chat' ? 'Coach' : tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.mainContent}>
                {activeTab === 'chat' && (
                    <AICoach
                        messages={chatMessages}
                        setMessages={setChatMessages}
                        isMobile={isMobile}
                    />
                )}

                {activeTab === 'tutorials' && (
                    <div className={styles.contentCard}>
                        <h2>Quick Start Tutorials</h2>
                        <div className={styles.tutorialGrid}>
                            {tutorials.map((tutorial, i) => (
                                <div key={i} className={styles.tutorialCard}>
                                    <div className={styles.tutorialHeader}>
                                        <div>
                                            <h3 className={styles.tutorialTitle}>{tutorial.title}</h3>
                                            <p className={styles.tutorialMeta}>
                                                {tutorial.time} • {tutorial.level}
                                            </p>
                                        </div>
                                        <span>→</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <footer className={styles.footer}>
                <div className={styles.footerContent}>
                    <div className={styles.footerBrand}>
                        <h3>APEX</h3>
                        <p>Your AI-powered path to internet money.<br />
                            No fluff. Just strategies that work.</p>
                    </div>

                    <div className={styles.footerLinks}>
                        <div className={styles.footerLinkGroup}>
                            <h4>Resources</h4>
                            <div className={styles.footerLinkList}>
                                <a href="#">Documentation</a>
                                <a href="#">Community</a>
                                <a href="#">Blog</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.footerBottom}>
                    <p>© 2025 APEX. Built for hustlers, by hustlers.</p>
                </div>
            </footer>
        </div>
    );
}

export default Dashboard;