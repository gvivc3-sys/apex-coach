import './App.css';
import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import Auth from './Auth';
import Dashboard from './Dashboard';

function App() {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
            window.scrollTo(0, 0);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
    }

    // If user is logged in, show dashboard
    if (session) {
        return <Dashboard user={session.user} />;
    }

    // Check URL params for auth
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('auth') === 'true') {
        return <Auth />;
    }

    // Show landing page
    const handleCheckout = (tier) => {
        const links = {
            starter: 'https://buy.stripe.com/test_eVqfZg7083Zz2xU3Dt1ck00',
            hustler: 'https://buy.stripe.com/test_aFa8wO84c1RrgoKc9Z1ck01',
            empire: 'https://buy.stripe.com/test_bJe28qesAgMla0m8XN1ck02'
        };

        window.location.href = links[tier];
    };

    return (
        <div className="apex-app">
            {/* Navigation */}
            <nav className="nav-fixed">
                <div className="nav-container">
                    <a href="/" className="logo">APEX</a>
                    <div className="nav-links">
                        <a href="#features">Features</a>
                        <a href="#pricing">Pricing</a>
                        <a href="#demo">Demo</a>
                        <button
                            className="secondary-button"
                            onClick={() => window.location.href = '/?auth=true'}
                        >
                            Login
                        </button>
                        <button
                            className="cta-button"
                            onClick={() => window.location.href = '/?auth=true'}
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <h1 className="hero-title">
                        RUN A BUSINESS<br />
                        <span className="accent">FROM YOUR LAPTOP</span>
                    </h1>
                    <p className="hero-subtitle">
                        Build a business with just a laptop. No boss. No limits. Pure profit.
                    </p>
                    <div className="hero-cta">
                        <button className="primary-button">Join APEX Now</button>
                        <button className="secondary-button">Watch Demo</button>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats">
                <div className="stats-container">
                    <div className="stat-card">
                        <div className="stat-number">$0</div>
                        <div className="stat-label">Just a Laptop Required</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">30 Days</div>
                        <div className="stat-label">To Your First Internet Money</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">100%</div>
                        <div className="stat-label">Location Independent</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">$25K/mo</div>
                        <div className="stat-label">Average Student Internet Income</div>
                    </div>
                </div>
            </section>

            {/* AI Coach Hero Section */}
            <section className="features" style={{
                background: 'var(--color-bg-alt)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Animated background grid */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `linear-gradient(rgba(212, 175, 55, 0.05) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(212, 175, 55, 0.05) 1px, transparent 1px)`,
                    backgroundSize: '50px 50px',
                    opacity: 0.3,
                    animation: 'gridMove 20s linear infinite'
                }} />

                <div className="features-container" style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 'var(--space-xl)',
                        marginBottom: 'var(--space-xl)',
                        flexWrap: 'wrap'
                    }}>
                        {/* AI Robot Animation */}
                        <div style={{ flex: '1', minWidth: '300px' }}>
                            <div style={{
                                width: '200px',
                                height: '200px',
                                margin: '0 auto',
                                position: 'relative',
                                animation: 'float 3s ease-in-out infinite'
                            }}>
                                {/* Robot head */}
                                <div style={{
                                    width: '120px',
                                    height: '100px',
                                    background: 'linear-gradient(135deg, var(--color-accent-gold), var(--color-accent-red))',
                                    borderRadius: '20px',
                                    position: 'absolute',
                                    top: '20px',
                                    left: '40px',
                                    boxShadow: '0 10px 40px rgba(212, 175, 55, 0.3)',
                                }}>
                                    {/* Eyes */}
                                    <div style={{
                                        width: '20px',
                                        height: '20px',
                                        background: 'var(--color-bg)',
                                        borderRadius: '50%',
                                        position: 'absolute',
                                        top: '30px',
                                        left: '25px',
                                        animation: 'blink 3s infinite'
                                    }} />
                                    <div style={{
                                        width: '20px',
                                        height: '20px',
                                        background: 'var(--color-bg)',
                                        borderRadius: '50%',
                                        position: 'absolute',
                                        top: '30px',
                                        right: '25px',
                                        animation: 'blink 3s infinite 0.1s'
                                    }} />
                                    {/* Antenna */}
                                    <div style={{
                                        width: '3px',
                                        height: '30px',
                                        background: 'var(--color-accent-gold)',
                                        position: 'absolute',
                                        top: '-30px',
                                        left: '50%',
                                        transform: 'translateX(-50%)'
                                    }}>
                                        <div style={{
                                            width: '10px',
                                            height: '10px',
                                            background: 'var(--color-accent-red)',
                                            borderRadius: '50%',
                                            position: 'absolute',
                                            top: '-5px',
                                            left: '-3.5px',
                                            animation: 'pulse 2s infinite'
                                        }} />
                                    </div>
                                </div>
                                {/* Body */}
                                <div style={{
                                    width: '140px',
                                    height: '80px',
                                    background: 'linear-gradient(135deg, var(--color-card-bg), var(--color-bg-alt))',
                                    border: '2px solid var(--color-accent-gold)',
                                    borderRadius: '15px',
                                    position: 'absolute',
                                    top: '120px',
                                    left: '30px',
                                }} />
                            </div>
                        </div>

                        {/* Content */}
                        <div style={{ flex: '2', minWidth: '300px' }}>
                            <h2 className="section-title" style={{ textAlign: 'left', marginBottom: 'var(--space-md)' }}>
                                MEET YOUR AI MONEY COACH
                            </h2>
                            <p style={{
                                fontSize: '18px',
                                color: 'var(--color-text-secondary)',
                                marginBottom: 'var(--space-lg)',
                                lineHeight: 1.8
                            }}>
                                APEX Coach isn't just another chatbot. It's <span style={{ color: 'var(--color-accent-gold)', fontWeight: '700' }}>10,000+ hours</span> of
                                copywriting materials, sales strategies, and proven business frameworks—compressed into
                                one AI that works alongside you 24/7.
                            </p>
                            <button
                                className="primary-button"
                                onClick={() => window.location.href = '/?auth=true'}
                            >
                                Start Chatting Now →
                            </button>
                        </div>
                    </div>

                    {/* Interactive Stats Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                        gap: 'var(--space-lg)',
                        marginBottom: 'var(--space-xl)'
                    }}>
                        {[
                            { number: '10,000+', label: 'Hours of Training Data', color: '#d4af37' },
                            { number: '500+', label: 'Business Strategies', color: '#e05446' },
                            { number: '24/7', label: 'Always Available', color: '#d4af37' },
                            { number: '< 30s', label: 'Response Time', color: '#e05446' }
                        ].map((stat, i) => (
                            <div
                                key={i}
                                className="stat-card"
                                style={{
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    animation: `fadeInUp 0.6s ease forwards ${i * 0.1}s`,
                                    opacity: 0
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                                    e.currentTarget.style.borderColor = stat.color;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                    e.currentTarget.style.borderColor = 'var(--color-border)';
                                }}
                            >
                                <div className="stat-number" style={{ color: stat.color }}>
                                    {stat.number}
                                </div>
                                <div className="stat-label">{stat.label}</div>
                                {/* Progress bar animation */}
                                <div style={{
                                    width: '100%',
                                    height: '3px',
                                    background: 'var(--color-border)',
                                    borderRadius: '2px',
                                    marginTop: 'var(--space-sm)',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{
                                        height: '100%',
                                        background: stat.color,
                                        width: '0%',
                                        animation: `fillBar 2s ease forwards ${i * 0.2 + 0.5}s`
                                    }} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Capabilities Grid */}
                    <div className="features-grid">
                        {[
                            { icon: '🧠', title: 'Trained on the Best', desc: 'Every high-converting sales letter, every successful product launch, every proven marketing framework—synthesized into actionable advice.' },
                            { icon: '⚡', title: 'Instant Strategy Sessions', desc: 'No waiting for coaching calls. Ask any question and get strategic responses based on what actually works—not theory.' },
                            { icon: '🎯', title: 'Personalized to Your Goals', desc: 'Adapts to your experience level, chosen business model, and specific challenges. Like having a personal business consultant.' },
                            { icon: '📈', title: 'Data-Driven Recommendations', desc: 'References specific tutorials, proven tactics, and real numbers from successful online businesses.' },
                            { icon: '🔥', title: 'Aggressive & Direct', desc: 'No corporate fluff. Pushes you toward action, gives exact dollar amounts, and tells you what platforms to use—right now.' },
                            { icon: '💡', title: 'Never Runs Out of Ideas', desc: 'Analyzed thousands of successful case studies and can suggest what works for your specific niche.' }
                        ].map((feature, i) => (
                            <div
                                key={i}
                                className="feature-card"
                                style={{
                                    animation: `fadeInUp 0.6s ease forwards ${i * 0.1}s`,
                                    opacity: 0
                                }}
                            >
                                <div className="feature-icon">{feature.icon}</div>
                                <h3 className="feature-title">{feature.title}</h3>
                                <p className="feature-description">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Add this to your App.css or create inline style tag */}
            <style>{`
    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
    }
    @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.5); opacity: 0.5; }
    }
    @keyframes blink {
        0%, 90%, 100% { height: 20px; }
        95% { height: 2px; }
    }
    @keyframes gridMove {
        0% { transform: translate(0, 0); }
        100% { transform: translate(50px, 50px); }
    }
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    @keyframes fillBar {
        from { width: 0%; }
        to { width: 100%; }
    }
`}</style>

            {/* Features Section */}
            <section className="features" id="features">
                <div className="features-container">
                    <h2 className="section-title">LAPTOP TO EMPIRE TOOLKIT</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">💻</div>
                            <h3 className="feature-title">Laptop Millionaire Blueprint</h3>
                            <p className="feature-description">Turn your laptop into an ATM. Copy-paste business models generating $10K+ monthly. WiFi and ambition are all you need.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">💸</div>
                            <h3 className="feature-title">Internet Money Daily</h3>
                            <p className="feature-description">Wake up to cash-generating tasks. Build stores, launch products, create content that converts. Every click makes money.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🚀</div>
                            <h3 className="feature-title">Zero-Cost Startups</h3>
                            <p className="feature-description">Start with nothing but a laptop and internet. We show you businesses that profit from day one - no inventory, no investment.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">📱</div>
                            <h3 className="feature-title">Digital Product Factory</h3>
                            <p className="feature-description">Create products once, sell forever. Templates, courses, tools - internet money that flows while you sleep.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🌍</div>
                            <h3 className="feature-title">Location Freedom</h3>
                            <p className="feature-description">Make money from Bali or your bedroom. Build a laptop business that travels with you. No office, no commute, just profit.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🤖</div>
                            <h3 className="feature-title">Automate Everything</h3>
                            <p className="feature-description">Set up systems that print internet money 24/7. One laptop, infinite income streams, zero employees needed.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="pricing" id="pricing">
                <div className="pricing-container">
                    <h2 className="section-title">CHOOSE YOUR WEAPON</h2>
                    <div className="pricing-grid">
                        <div className="pricing-card">
                            <div className="pricing-tier">Starter</div>
                            <div className="pricing-amount">$47</div>
                            <div className="pricing-period">per month</div>
                            <ul className="pricing-features">
                                <li>Daily internet money tasks</li>
                                <li>5 laptop businesses monthly</li>
                                <li>Product flipping alerts</li>
                                <li>Basic digital product templates</li>
                                <li>Internet money community</li>
                            </ul>
                            <button
                                className="secondary-button"
                                style={{ width: '100%' }}
                                onClick={() => handleCheckout('starter')}
                            >
                                Start Hustling
                            </button>
                        </div>

                        <div className="pricing-card featured">
                            <div className="pricing-tier">Hustler</div>
                            <div className="pricing-amount">$197</div>
                            <div className="pricing-period">per month</div>
                            <ul className="pricing-features">
                                <li>Unlimited laptop business coaching</li>
                                <li>$0-10K internet money blueprint</li>
                                <li>Hot product alerts (pre-viral)</li>
                                <li>Done-for-you online stores</li>
                                <li>50+ laptop income streams</li>
                                <li>Weekly internet money reports</li>
                            </ul>
                            <button
                                className="primary-button"
                                style={{ width: '100%' }}
                                onClick={() => handleCheckout('hustler')}
                            >
                                Scale Now
                            </button>
                        </div>

                        <div className="pricing-card">
                            <div className="pricing-tier">Empire Builder</div>
                            <div className="pricing-amount">$597</div>
                            <div className="pricing-period">per month</div>
                            <ul className="pricing-features">
                                <li>Elite internet money strategies</li>
                                <li>7-figure laptop business blueprint</li>
                                <li>Automated income systems</li>
                                <li>Private mastermind (laptop millionaires)</li>
                                <li>Custom internet money research</li>
                                <li>Exit strategy (sell for millions)</li>
                            </ul>
                            <button
                                className="secondary-button"
                                style={{ width: '100%' }}
                                onClick={() => handleCheckout('empire')}
                            >
                                Apply Now
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            {/* Footer */}
            <footer>
                <div className="footer-content">
                    <div className="footer-links">
                        <a href="#">Terms</a>
                        <a href="#">Privacy</a>
                        <a href="#">Contact</a>
                        <a href="#">Careers</a>
                    </div>
                    <div className="copyright">
                        © 2025 APEX. Internet money. Laptop lifestyle. Total freedom.
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;