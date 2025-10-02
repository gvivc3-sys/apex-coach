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
                        MASTER THE<br />
                        <span className="accent">INTERNET MONEY</span>
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