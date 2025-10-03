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

            {/* AI Coach Section */}
            <section className="features" style={{ background: 'var(--color-bg-alt)' }}>
                <div className="features-container">
                    <h2 className="section-title">MEET YOUR AI MONEY COACH</h2>
                    <p style={{
                        textAlign: 'center',
                        maxWidth: '800px',
                        margin: '0 auto var(--space-xl)',
                        fontSize: '18px',
                        color: 'var(--color-text-secondary)'
                    }}>
                        APEX Coach isn't just another chatbot. It's the collective intelligence of 10,000+ hours
                        of copywriting materials, sales strategies, and proven business frameworks—compressed into
                        one AI that works alongside you 24/7.
                    </p>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: 'var(--space-lg)',
                        marginBottom: 'var(--space-xl)'
                    }}>
                        <div className="stat-card">
                            <div className="stat-number">10,000+</div>
                            <div className="stat-label">Hours of Training Data</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">500+</div>
                            <div className="stat-label">Business Strategies Analyzed</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">24/7</div>
                            <div className="stat-label">Always Available Coaching</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">< 30s</div>
                            <div className="stat-label">Average Response Time</div>
                        </div>
                    </div>

                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">🧠</div>
                            <h3 className="feature-title">Trained on the Best</h3>
                            <p className="feature-description">
                                Every high-converting sales letter, every successful product launch,
                                every proven marketing framework—synthesized into actionable advice you can use immediately.
                            </p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">⚡</div>
                            <h3 className="feature-title">Instant Strategy Sessions</h3>
                            <p className="feature-description">
                                No waiting for coaching calls. Ask any question about your business and get
                                strategic responses based on what actually works—not theory.
                            </p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🎯</div>
                            <h3 className="feature-title">Personalized to Your Goals</h3>
                            <p className="feature-description">
                                APEX Coach adapts to your experience level, chosen business model, and specific
                                challenges. It's like having a personal business consultant who knows your situation.
                            </p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">📈</div>
                            <h3 className="feature-title">Data-Driven Recommendations</h3>
                            <p className="feature-description">
                                Not generic advice. APEX Coach references specific tutorials, proven tactics,
                                and real numbers from successful online businesses to guide your decisions.
                            </p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🔥</div>
                            <h3 className="feature-title">Aggressive & Direct</h3>
                            <p className="feature-description">
                                No corporate fluff. APEX Coach pushes you toward action, gives you exact dollar
                                amounts, and tells you what platforms to use—right now, not someday.
                            </p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">💡</div>
                            <h3 className="feature-title">Never Runs Out of Ideas</h3>
                            <p className="feature-description">
                                Stuck on product selection? Pricing strategy? Traffic sources? APEX Coach has
                                analyzed thousands of successful case studies and can suggest what works for your niche.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Traditional vs APEX */}
            <section className="features">
                <div className="features-container">
                    <h2 className="section-title">WHY APEX COACH BEATS TRADITIONAL LEARNING</h2>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: 'var(--space-xl)',
                        maxWidth: '1000px',
                        margin: '0 auto'
                    }}>
                        {/* Traditional Way */}
                        <div style={{
                            padding: 'var(--space-xl)',
                            background: 'var(--color-bg-alt)',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-md)'
                        }}>
                            <h3 style={{
                                marginBottom: 'var(--space-lg)',
                                color: 'var(--color-text-secondary)',
                                textAlign: 'center'
                            }}>
                                Traditional Learning
                            </h3>
                            <ul style={{
                                listStyle: 'none',
                                padding: 0,
                                color: 'var(--color-text-secondary)'
                            }}>
                                <li style={{
                                    padding: 'var(--space-sm) 0',
                                    borderBottom: '1px solid var(--color-border)'
                                }}>
                                    ❌ Watch 40+ hour courses
                                </li>
                                <li style={{
                                    padding: 'var(--space-sm) 0',
                                    borderBottom: '1px solid var(--color-border)'
                                }}>
                                    ❌ Search through 100+ YouTube videos
                                </li>
                                <li style={{
                                    padding: 'var(--space-sm) 0',
                                    borderBottom: '1px solid var(--color-border)'
                                }}>
                                    ❌ Pay $2K+ for coaching programs
                                </li>
                                <li style={{
                                    padding: 'var(--space-sm) 0',
                                    borderBottom: '1px solid var(--color-border)'
                                }}>
                                    ❌ Wait days for email responses
                                </li>
                                <li style={{
                                    padding: 'var(--space-sm) 0',
                                    borderBottom: '1px solid var(--color-border)'
                                }}>
                                    ❌ Generic advice that doesn't fit your situation
                                </li>
                                <li style={{
                                    padding: 'var(--space-sm) 0'
                                }}>
                                    ❌ Outdated strategies from 2019
                                </li>
                            </ul>
                        </div>

                        {/* APEX Way */}
                        <div style={{
                            padding: 'var(--space-xl)',
                            background: 'linear-gradient(135deg, var(--color-card-bg), var(--color-bg-alt))',
                            border: '2px solid var(--color-accent-gold)',
                            borderRadius: 'var(--radius-md)',
                            boxShadow: '0 8px 24px rgba(212, 175, 55, 0.2)'
                        }}>
                            <h3 style={{
                                marginBottom: 'var(--space-lg)',
                                color: 'var(--color-accent-gold)',
                                textAlign: 'center'
                            }}>
                                The APEX Way
                            </h3>
                            <ul style={{
                                listStyle: 'none',
                                padding: 0,
                                color: 'var(--color-text-primary)'
                            }}>
                                <li style={{
                                    padding: 'var(--space-sm) 0',
                                    borderBottom: '1px solid var(--color-border)'
                                }}>
                                    ✅ Ask one question, get instant answer
                                </li>
                                <li style={{
                                    padding: 'var(--space-sm) 0',
                                    borderBottom: '1px solid var(--color-border)'
                                }}>
                                    ✅ All tutorials condensed into chat
                                </li>
                                <li style={{
                                    padding: 'var(--space-sm) 0',
                                    borderBottom: '1px solid var(--color-border)'
                                }}>
                                    ✅ Starting at $47/month
                                </li>
                                <li style={{
                                    padding: 'var(--space-sm) 0',
                                    borderBottom: '1px solid var(--color-border)'
                                }}>
                                    ✅ 24/7 instant coaching responses
                                </li>
                                <li style={{
                                    padding: 'var(--space-sm) 0',
                                    borderBottom: '1px solid var(--color-border)'
                                }}>
                                    ✅ Personalized to YOUR business model
                                </li>
                                <li style={{
                                    padding: 'var(--space-sm) 0'
                                }}>
                                    ✅ Updated with current strategies
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div style={{
                        textAlign: 'center',
                        marginTop: 'var(--space-xl)'
                    }}>
                        <p style={{
                            fontSize: '20px',
                            fontWeight: '700',
                            marginBottom: 'var(--space-lg)',
                            color: 'var(--color-text-primary)'
                        }}>
                            Stop wasting months learning. Start making money this week.
                        </p>
                        <button
                            className="primary-button"
                            onClick={() => window.location.href = '/?auth=true'}
                            style={{ fontSize: '16px', padding: 'var(--space-md) var(--space-xl)' }}
                        >
                            Get APEX Coach Now
                        </button>
                    </div>
                </div>
            </section>

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