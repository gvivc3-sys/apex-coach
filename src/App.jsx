import './App.css';
import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import Auth from './Auth';
import Dashboard from './Dashboard';

function App() {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
            window.scrollTo(0, 0);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
    }

    if (session) {
        return <Dashboard user={session.user} />;
    }

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('auth') === 'true') {
        return <Auth />;
    }

    const handleCheckout = async (tier) => {
        const priceIds = {
            starter: 'price_1SEn0yAar01uwreK3Tg2Ifc2',
            hustler: 'price_1SEn1NAar01uwreKkxjqEr16',
            empire: 'price_1SEn1hAar01uwreKL4HLzKzS'
        };

        try {
            const response = await fetch('/api/create-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    priceId: priceIds[tier],
                    tier: tier
                })
            });

            const { url } = await response.json();
            if (url) window.location.href = url;
        } catch (error) {
            console.error('Checkout error:', error);
        }
    };

    return (
        <div className="apex-app">
            {/* Navigation */}
            <nav className="nav-fixed">
                <div className="nav-container">
                    <a href="/" className="logo">APEX</a>
                    <div className="nav-links">
                        <a href="#pricing">Pricing</a>
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
                        TIKTOK SHOP<br />
                        <span className="accent">AFFILIATE MASTERY</span>
                    </h1>
                    <p className="hero-subtitle">
                        Turn TikTok videos into consistent affiliate commissions. No products. No inventory. Just content and cash.
                    </p>
                    <div className="hero-cta">
                        <button
                            className="primary-button"
                            onClick={() => document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' })}
                        >
                            Start Making Commissions
                        </button>
                        <button className="secondary-button">See Proof</button>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats">
                <div className="stats-container">
                    <div className="stat-card">
                        <div className="stat-number">$0</div>
                        <div className="stat-label">Startup Cost Required</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">8-15%</div>
                        <div className="stat-label">Commission on Every Sale</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">7 Days</div>
                        <div className="stat-label">To First Commission</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">$5K+</div>
                        <div className="stat-label">Monthly Potential</div>
                    </div>
                </div>
            </section>

            {/* What You Get */}
            <section className="features" style={{ background: 'var(--color-bg-alt)' }}>
                <div className="features-container">
                    <h2 className="section-title">THE TIKTOK SHOP BLUEPRINT</h2>
                    <p style={{
                        textAlign: 'center',
                        maxWidth: '700px',
                        margin: '0 auto var(--space-xl)',
                        fontSize: '18px',
                        color: 'var(--color-text-secondary)'
                    }}>
                        Everything you need to start earning affiliate commissions from TikTok Shop in the next 7 days.
                    </p>

                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">🎯</div>
                            <h3 className="feature-title">Product Selection Strategy</h3>
                            <p className="feature-description">
                                Learn exactly which products convert on TikTok Shop. We show you how to find high-commission items that people actually buy.
                            </p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">📱</div>
                            <h3 className="feature-title">Content Templates</h3>
                            <p className="feature-description">
                                Proven video scripts and hooks that drive clicks. Copy successful formats that have generated thousands in commissions.
                            </p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🤖</div>
                            <h3 className="feature-title">AI-Powered Coach</h3>
                            <p className="feature-description">
                                24/7 access to an AI trained on TikTok affiliate strategies. Get instant answers about products, content, and optimization.
                            </p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">📈</div>
                            <h3 className="feature-title">Algorithm Hacks</h3>
                            <p className="feature-description">
                                Understand how TikTok's algorithm works and how to get your affiliate content on the For You Page consistently.
                            </p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">💰</div>
                            <h3 className="feature-title">Commission Maximization</h3>
                            <p className="feature-description">
                                Strategies to increase your average order value and earn more per sale. Turn $50 commissions into $200+.
                            </p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🔥</div>
                            <h3 className="feature-title">Trending Product Alerts</h3>
                            <p className="feature-description">
                                Get notified about products going viral before everyone else. Jump on trends early for maximum commission potential.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* AI Coach Spotlight */}
            <section className="features">
                <div className="features-container">
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 'var(--space-xl)',
                        marginBottom: 'var(--space-xl)',
                        flexWrap: 'wrap'
                    }}>
                        {/* AI Visual */}
                        <div style={{ flex: '1', minWidth: '300px' }}>
                            <div style={{
                                width: '200px',
                                height: '200px',
                                margin: '0 auto',
                                position: 'relative',
                                animation: 'float 3s ease-in-out infinite'
                            }}>
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
                                YOUR TIKTOK EXPERT, 24/7
                            </h2>
                            <p style={{
                                fontSize: '18px',
                                color: 'var(--color-text-secondary)',
                                marginBottom: 'var(--space-lg)',
                                lineHeight: 1.8
                            }}>
                                Most courses give you videos and leave you stuck. We give you an AI trained on
                                <span style={{ color: 'var(--color-accent-gold)', fontWeight: '700' }}> 1,000+ hours</span> of
                                TikTok Shop strategies, viral video breakdowns, and commission-generating tactics.
                            </p>
                            <ul style={{
                                listStyle: 'none',
                                padding: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 'var(--space-sm)'
                            }}>
                                {[
                                    'Ask which products to promote right now',
                                    'Get video script ideas in seconds',
                                    'Troubleshoot why your videos aren\'t converting',
                                    'Learn trending hashtag strategies',
                                    'Optimize your account for maximum reach'
                                ].map((item, i) => (
                                    <li key={i} style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: 'var(--space-sm)',
                                        color: 'var(--color-text-primary)'
                                    }}>
                                        <span style={{ color: 'var(--color-accent-gold)', fontSize: '20px' }}>✓</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: 'var(--space-lg)',
                        marginTop: 'var(--space-xl)'
                    }}>
                        {[
                            { number: '1,000+', label: 'Hours TikTok Training', color: '#d4af37' },
                            { number: '500+', label: 'Viral Videos Analyzed', color: '#e05446' },
                            { number: '24/7', label: 'Instant Answers', color: '#d4af37' },
                            { number: '< 10s', label: 'Response Time', color: '#e05446' }
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
                            >
                                <div className="stat-number" style={{ color: stat.color }}>
                                    {stat.number}
                                </div>
                                <div className="stat-label">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Example Interaction */}
                    <div style={{
                        marginTop: 'var(--space-xl)',
                        padding: 'var(--space-xl)',
                        background: 'var(--color-bg-alt)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-md)',
                        maxWidth: '700px',
                        margin: 'var(--space-xl) auto 0'
                    }}>
                        <h3 style={{
                            fontSize: '18px',
                            marginBottom: 'var(--space-lg)',
                            color: 'var(--color-text-primary)',
                            textAlign: 'center'
                        }}>
                            Example: Ask Anything About TikTok Shop
                        </h3>
                        <div style={{
                            background: 'var(--color-card-bg)',
                            padding: 'var(--space-md)',
                            borderRadius: 'var(--radius-sm)',
                            marginBottom: 'var(--space-md)',
                            borderLeft: '3px solid var(--color-accent-gold)'
                        }}>
                            <p style={{
                                color: 'var(--color-text-secondary)',
                                fontSize: '14px',
                                marginBottom: '4px'
                            }}>
                                You:
                            </p>
                            <p style={{ color: 'var(--color-text-primary)' }}>
                                "What beauty products are converting best this week?"
                            </p>
                        </div>
                        <div style={{
                            background: 'var(--color-card-bg)',
                            padding: 'var(--space-md)',
                            borderRadius: 'var(--radius-sm)',
                            borderLeft: '3px solid var(--color-accent-red)'
                        }}>
                            <p style={{
                                color: 'var(--color-text-secondary)',
                                fontSize: '14px',
                                marginBottom: '4px'
                            }}>
                                AI Coach:
                            </p>
                            <p style={{ color: 'var(--color-text-primary)' }}>
                                "Top 3 right now: Viral lash serums (12% commission), LED face masks ($8-15 per sale),
                                and Korean skincare sets. Lash serums are exploding because of the 'before/after' hook.
                                Try the CeraVe dupe angle for skincare - it's crushing. Here's a script template..."
                            </p>
                        </div>
                    </div>
                </div>
            </section>

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
            `}</style>

            {/* How It Works */}
            <section className="features">
                <div className="features-container">
                    <h2 className="section-title">YOUR PATH TO $5K/MONTH</h2>

                    <div style={{
                        maxWidth: '800px',
                        margin: '0 auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 'var(--space-xl)'
                    }}>
                        {[
                            {
                                step: '01',
                                title: 'Find Winning Products',
                                desc: 'Use our AI coach to identify TikTok Shop products with high commissions and proven sales history. Takes 15 minutes.'
                            },
                            {
                                step: '02',
                                title: 'Create Content',
                                desc: 'Follow our templates to make 3-5 videos per day. No fancy equipment needed - phone camera works perfectly.'
                            },
                            {
                                step: '03',
                                title: 'Post & Optimize',
                                desc: 'Upload during peak hours, use our hashtag strategy, and let the algorithm do its work. Most videos hit FYP within 2 hours.'
                            },
                            {
                                step: '04',
                                title: 'Scale What Works',
                                desc: 'Double down on products and video styles that convert. Go from $500/month to $5K+ by replicating winners.'
                            }
                        ].map((item, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                gap: 'var(--space-lg)',
                                alignItems: 'flex-start',
                                padding: 'var(--space-lg)',
                                background: 'var(--color-card-bg)',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-md)'
                            }}>
                                <div style={{
                                    fontSize: '32px',
                                    fontWeight: '700',
                                    color: 'var(--color-accent-gold)',
                                    minWidth: '60px'
                                }}>
                                    {item.step}
                                </div>
                                <div>
                                    <h3 style={{
                                        fontSize: '20px',
                                        marginBottom: 'var(--space-sm)',
                                        color: 'var(--color-text-primary)'
                                    }}>
                                        {item.title}
                                    </h3>
                                    <p style={{
                                        color: 'var(--color-text-secondary)',
                                        lineHeight: 1.6
                                    }}>
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="pricing" id="pricing">
                <div className="pricing-container">
                    <h2 className="section-title">CHOOSE YOUR PLAN</h2>
                    <div className="pricing-grid">
                        <div className="pricing-card">
                            <div className="pricing-tier">Starter</div>
                            <div className="pricing-amount">$27</div>
                            <div className="pricing-period">per month</div>
                            <ul className="pricing-features">
                                <li>AI Coach access</li>
                                <li>Core TikTok Shop training</li>
                                <li>Product research tools</li>
                                <li>Content templates</li>
                                <li>Community access</li>
                            </ul>
                            <button
                                className="secondary-button"
                                style={{ width: '100%' }}
                                onClick={() => handleCheckout('starter')}
                            >
                                Start Now
                            </button>
                        </div>

                        <div className="pricing-card featured">
                            <div className="pricing-tier">Hustler</div>
                            <div className="pricing-amount">$47</div>
                            <div className="pricing-period">per month</div>
                            <ul className="pricing-features">
                                <li>Everything in Starter</li>
                                <li>Advanced algorithm strategies</li>
                                <li>Daily trending product alerts</li>
                                <li>Viral video breakdowns</li>
                                <li>Priority AI responses</li>
                                <li>Weekly group calls</li>
                            </ul>
                            <button
                                className="primary-button"
                                style={{ width: '100%' }}
                                onClick={() => handleCheckout('hustler')}
                            >
                                Most Popular
                            </button>
                        </div>

                        <div className="pricing-card">
                            <div className="pricing-tier">Empire</div>
                            <div className="pricing-amount">$67</div>
                            <div className="pricing-period">per month</div>
                            <ul className="pricing-features">
                                <li>Everything in Hustler</li>
                                <li>1-on-1 strategy calls</li>
                                <li>Custom niche research</li>
                                <li>Account audit & optimization</li>
                                <li>Scaling blueprint ($10K+/mo)</li>
                                <li>Private mastermind group</li>
                            </ul>
                            <button
                                className="secondary-button"
                                style={{ width: '100%' }}
                                onClick={() => handleCheckout('empire')}
                            >
                                Go Premium
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
                    </div>
                    <div className="copyright">
                        © 2025 APEX. TikTok Shop Affiliate Training.
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;