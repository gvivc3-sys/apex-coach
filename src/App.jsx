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

            {/* Pricing Section */}
            <section className="pricing" id="pricing">
                <div className="pricing-container">
                    <h2 className="section-title">CHOOSE YOUR WEAPON</h2>
                    <div className="pricing-grid">
                        <div className="pricing-card">
                            <div className="pricing-tier">Starter</div>
                            <div className="pricing-amount">$27</div>
                            <div className="pricing-period">per month</div>
                            <ul className="pricing-features">
                                <li>AI Coach (100K tokens/month)</li>
                                <li>Core tutorials library</li>
                                <li>Basic product templates</li>
                                <li>Community access</li>
                                <li>Weekly strategy emails</li>
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
                                <li>AI Coach (200K tokens/month)</li>
                                <li>All tutorials + new releases</li>
                                <li>Advanced frameworks</li>
                                <li>Priority support</li>
                                <li>Private group access</li>
                                <li>Monthly strategy calls</li>
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
                                <li>AI Coach (300K tokens/month)</li>
                                <li>Everything in Hustler, plus:</li>
                                <li>1-on-1 monthly calls</li>
                                <li>Custom strategy research</li>
                                <li>Done-for-you templates</li>
                                <li>Exit planning & scaling help</li>
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