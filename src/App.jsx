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
                        AI-Powered Crypto Trading Signals<br />
                        <span className="accent">Catch Every Market Move</span>
                    </h1>
                    <p className="hero-subtitle">
                        Our AI monitors charts, scanners, and market patterns 24/7<br />
                        Get high-probability trading calls delivered in real-time—no analysis paralysis, just profitable setups
                    </p>
                    <div className="hero-cta">
                        <button
                            className="primary-button"
                            onClick={() => document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' })}
                        >
                            Start Trading Smarter
                        </button>
                        <button
                            className="secondary-button"
                            onClick={() => document.getElementById('demo').scrollIntoView({ behavior: 'smooth' })}
                        >
                            See Live Signals
                        </button>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats">
                <div className="stats-container">
                    <div className="stat-card">
                        <div className="stat-number">87%</div>
                        <div className="stat-label">Win Rate (30 Days)</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">24/7</div>
                        <div className="stat-label">Market Monitoring</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">15-50</div>
                        <div className="stat-label">Signals Per Week</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number">3.2x</div>
                        <div className="stat-label">Avg Return Multiple</div>
                    </div>
                </div>
            </section>

            {/* Why Most Fail Section */}
            <section className="features" id="demo">
                <div className="container">
                    <h2 className="section-title">Why Most Traders Fail (And How Our AI Fixes It)</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">❌</div>
                            <h3 className="feature-title">The Old Way: Emotional Trading</h3>
                            <p className="feature-description">
                                Spending hours staring at charts, making impulsive decisions based on FOMO and fear. 90% of manual traders lose money.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">✅</div>
                            <h3 className="feature-title">The APEX Way: AI-Driven Precision</h3>
                            <p className="feature-description">
                                Our AI analyzes 1000+ data points per second, identifies high-probability setups, and sends you clear entry/exit signals. No emotions, just data.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Live Signals Preview */}
            <section className="demo">
                <div className="container">
                    <h2 className="section-title">REAL-TIME SIGNAL FEED</h2>
                    <div className="chat-container">
                        <div className="chat-header">
                            <div className="chat-avatar">🤖</div>
                            <div>
                                <div style={{ fontWeight: 'bold' }}>APEX AI Trading System</div>
                                <div style={{ fontSize: '12px', opacity: 0.9 }}>Live Market Scanner</div>
                            </div>
                        </div>
                        <div className="chat-messages">
                            <div className="message ai">
                                <div className="chat-avatar" style={{ background: 'var(--color-accent-gold)', width: '30px', height: '30px', fontSize: '16px' }}>🎯</div>
                                <div className="message-content">
                                    <strong>🟢 LONG SIGNAL: BTC/USDT</strong><br />
                                    Entry: $43,250 - $43,400<br />
                                    Target 1: $44,100 (2%)<br />
                                    Target 2: $44,800 (3.5%)<br />
                                    Target 3: $45,500 (5.2%)<br />
                                    Stop Loss: $42,800<br />
                                    <span style={{ color: 'var(--color-accent-gold)' }}>Risk/Reward: 1:4.3 | Confidence: HIGH</span>
                                </div>
                            </div>
                            <div className="message ai">
                                <div className="chat-avatar" style={{ background: 'var(--color-accent-purple)', width: '30px', height: '30px', fontSize: '16px' }}>📊</div>
                                <div className="message-content">
                                    <strong>⚡ BREAKOUT ALERT: ETH/USDT</strong><br />
                                    Bullish flag pattern confirmed on 4H<br />
                                    Volume spike detected (+230%)<br />
                                    Entry Zone: $2,280 - $2,295<br />
                                    Projected Move: +8-12% (24-48 hours)<br />
                                    <span style={{ color: 'var(--color-accent-purple)' }}>Pattern Success Rate: 78%</span>
                                </div>
                            </div>
                            <div className="message ai">
                                <div className="chat-avatar" style={{ background: 'var(--color-accent-blue)', width: '30px', height: '30px', fontSize: '16px' }}>💎</div>
                                <div className="message-content">
                                    <strong>🔵 ALTCOIN GEM: SOL/USDT</strong><br />
                                    AI detected accumulation phase complete<br />
                                    Smart money flowing in (Whale Alert)<br />
                                    Current Price: $98.45<br />
                                    Expected Move: $115-125 (7-10 days)<br />
                                    <span style={{ color: 'var(--color-accent-blue)' }}>AI Confidence Score: 92/100</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <p style={{ color: 'var(--color-text-secondary)' }}>Live signals updating every 30 seconds • Members-only access</p>
                    </div>
                </div>
            </section>

            {/* What You Get Section */}
            <section className="features">
                <div className="container">
                    <h2 className="section-title">What Our AI Tracks For You 24/7</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">📈</div>
                            <h3 className="feature-title">Technical Analysis</h3>
                            <p className="feature-description">
                                Monitors 50+ indicators across all timeframes. RSI, MACD, Bollinger Bands, Fibonacci levels, and more—all automated.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">🐋</div>
                            <h3 className="feature-title">Whale Movements</h3>
                            <p className="feature-description">
                                Tracks large wallet movements and exchange flows. Know when smart money is accumulating or distributing.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">📊</div>
                            <h3 className="feature-title">Market Sentiment</h3>
                            <p className="feature-description">
                                Analyzes social media, news, and fear/greed index in real-time. Catches momentum shifts before they happen.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">🎯</div>
                            <h3 className="feature-title">Pattern Recognition</h3>
                            <p className="feature-description">
                                Identifies chart patterns with 85%+ historical success rates. Flags, wedges, triangles—nothing escapes our AI.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">⚡</div>
                            <h3 className="feature-title">Volume Analysis</h3>
                            <p className="feature-description">
                                Detects unusual volume spikes and order book imbalances. Spots breakouts before they explode.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">🔔</div>
                            <h3 className="feature-title">Instant Alerts</h3>
                            <p className="feature-description">
                                Get signals via Telegram, Discord, or SMS. Never miss a profitable setup, even while you sleep.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="pricing" id="pricing">
                <div className="container">
                    <h2 className="section-title">Choose Your Trading Edge</h2>
                    <p className="section-subtitle">
                        Start with any plan. Upgrade anytime. Cancel anytime.
                    </p>

                    <div className="pricing-grid">
                        {/* Starter Plan */}
                        <div className="pricing-card">
                            <div className="plan-badge" style={{ background: 'var(--color-accent-blue)' }}>BEGINNER</div>
                            <h3 className="plan-name">Starter Signals</h3>
                            <div className="plan-price">
                                <span style={{ fontSize: '36px', fontWeight: 'bold' }}>$97</span>
                                <span style={{ fontSize: '16px', opacity: 0.8 }}>/month</span>
                            </div>
                            <ul className="plan-features">
                                <li>✅ 10-15 Trading Signals/Week</li>
                                <li>✅ Major Pairs Only (BTC, ETH, SOL)</li>
                                <li>✅ Entry & Exit Points</li>
                                <li>✅ Stop Loss Levels</li>
                                <li>✅ Telegram Alerts</li>
                                <li>✅ Basic Market Analysis</li>
                                <li>❌ Altcoin Gems</li>
                                <li>❌ 1-on-1 Support</li>
                            </ul>
                            <button
                                className="primary-button"
                                style={{ width: '100%' }}
                                onClick={() => handleCheckout('starter')}
                            >
                                Start Trading
                            </button>
                            <p style={{ marginTop: '12px', fontSize: '12px', color: 'var(--color-text-muted)' }}>Perfect for beginners with $500-5K portfolios</p>
                        </div>

                        {/* Pro Plan */}
                        <div className="pricing-card featured">
                            <div className="plan-badge" style={{ background: 'var(--color-accent-gold)' }}>MOST POPULAR</div>
                            <h3 className="plan-name">Pro Trader</h3>
                            <div className="plan-price">
                                <span style={{ fontSize: '36px', fontWeight: 'bold' }}>$297</span>
                                <span style={{ fontSize: '16px', opacity: 0.8 }}>/month</span>
                            </div>
                            <ul className="plan-features">
                                <li>✅ 25-35 Trading Signals/Week</li>
                                <li>✅ All Cryptocurrencies</li>
                                <li>✅ Detailed Entry/Exit Strategy</li>
                                <li>✅ Risk Management Guide</li>
                                <li>✅ Telegram + Discord Access</li>
                                <li>✅ Daily Market Reports</li>
                                <li>🔥 Altcoin Gems (10x potential)</li>
                                <li>🔥 Priority Support</li>
                            </ul>
                            <button
                                className="cta-button"
                                style={{ width: '100%', background: 'var(--color-accent-gold)', color: 'var(--color-bg-primary)' }}
                                onClick={() => handleCheckout('hustler')}
                            >
                                Go Pro Now
                            </button>
                            <p style={{ marginTop: '12px', fontSize: '12px', color: 'var(--color-text-muted)' }}>Best value for serious traders</p>
                        </div>

                        {/* VIP Plan */}
                        <div className="pricing-card">
                            <div className="plan-badge" style={{ background: 'var(--color-accent-purple)' }}>VIP ACCESS</div>
                            <h3 className="plan-name">Whale Club</h3>
                            <div className="plan-price">
                                <span style={{ fontSize: '36px', fontWeight: 'bold' }}>$997</span>
                                <span style={{ fontSize: '16px', opacity: 0.8 }}>/month</span>
                            </div>
                            <ul className="plan-features">
                                <li>✅ UNLIMITED Signals</li>
                                <li>✅ All Features from Pro</li>
                                <li>✅ Futures & Options Calls</li>
                                <li>✅ ICO/IDO Early Access</li>
                                <li>✅ Private Discord Channel</li>
                                <li>✅ Weekly Strategy Calls</li>
                                <li>💎 1-on-1 Coaching (2hrs/month)</li>
                                <li>💎 Custom AI Bot Access</li>
                                <li>💎 Copy Trading Integration</li>
                            </ul>
                            <button
                                className="secondary-button"
                                style={{ width: '100%' }}
                                onClick={() => handleCheckout('empire')}
                            >
                                Join Whale Club
                            </button>
                            <p style={{ marginTop: '12px', fontSize: '12px', color: 'var(--color-text-muted)' }}>For traders managing $50K+ portfolios</p>
                        </div>
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '40px', padding: '24px', background: 'var(--color-card-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto' }}>
                        <h3 style={{ color: 'var(--color-accent-gold)', marginBottom: '12px' }}>🔒 7-Day Money-Back Guarantee</h3>
                        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 0, fontSize: '14px' }}>
                            Try APEX risk-free for 7 days. If our signals don't perform as advertised, get a full refund. No questions asked.
                        </p>
                    </div>
                </div>
            </section>

            {/* Why It Works */}
            <section className="features">
                <div className="container">
                    <h2 className="section-title">Why APEX Beats Human Traders</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">🧠</div>
                            <h3 className="feature-title">Zero Emotions</h3>
                            <p className="feature-description">
                                AI doesn't panic sell or FOMO buy. Every decision is based on pure data and probability, not fear or greed.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">⚡</div>
                            <h3 className="feature-title">Lightning Fast</h3>
                            <p className="feature-description">
                                Analyzes 1000+ data points per second. Catches opportunities in microseconds that humans would miss.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">🎯</div>
                            <h3 className="feature-title">Battle-Tested</h3>
                            <p className="feature-description">
                                Backtested on 5+ years of market data. Every signal is based on patterns with proven success rates.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">📚</div>
                            <h3 className="feature-title">Always Learning</h3>
                            <p className="feature-description">
                                Our AI improves daily by analyzing millions of trades. It gets smarter while you sleep.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">🌍</div>
                            <h3 className="feature-title">24/7 Coverage</h3>
                            <p className="feature-description">
                                Crypto never sleeps, neither does our AI. Catch Asian pumps, European dumps, and American rallies.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">🔄</div>
                            <h3 className="feature-title">Multi-Strategy</h3>
                            <p className="feature-description">
                                Combines scalping, swing trading, and position trading. Profits in bull markets, bear markets, and sideways action.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="stats">
                <div className="container" style={{ maxWidth: '900px' }}>
                    <h2 className="section-title">Frequently Asked Questions</h2>
                    <div style={{ display: 'grid', gap: '16px', marginTop: '40px' }}>
                        <div className="stat-card" style={{ textAlign: 'left', padding: 'var(--space-lg)' }}>
                            <h3 style={{ color: 'var(--color-accent-gold)', marginBottom: '8px' }}>Do I need trading experience?</h3>
                            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 0 }}>No. Our signals include exact entry points, targets, and stop losses. Just follow the instructions. We also provide educational content for beginners.</p>
                        </div>

                        <div className="stat-card" style={{ textAlign: 'left', padding: 'var(--space-lg)' }}>
                            <h3 style={{ color: 'var(--color-accent-gold)', marginBottom: '8px' }}>What's your average win rate?</h3>
                            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 0 }}>87% over the last 30 days, 82% over the last 6 months. We focus on high-probability setups with favorable risk/reward ratios.</p>
                        </div>

                        <div className="stat-card" style={{ textAlign: 'left', padding: 'var(--space-lg)' }}>
                            <h3 style={{ color: 'var(--color-accent-gold)', marginBottom: '8px' }}>Which exchanges do you support?</h3>
                            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 0 }}>All major exchanges: Binance, Coinbase, Kraken, Bybit, OKX, etc. Our signals work on any platform that trades the pairs we analyze.</p>
                        </div>

                        <div className="stat-card" style={{ textAlign: 'left', padding: 'var(--space-lg)' }}>
                            <h3 style={{ color: 'var(--color-accent-gold)', marginBottom: '8px' }}>How much capital do I need?</h3>
                            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 0 }}>You can start with as little as $500. We recommend $2,000+ for optimal position sizing and risk management.</p>
                        </div>

                        <div className="stat-card" style={{ textAlign: 'left', padding: 'var(--space-lg)' }}>
                            <h3 style={{ color: 'var(--color-accent-gold)', marginBottom: '8px' }}>Do you offer futures/leverage trading?</h3>
                            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 0 }}>Yes, in our Pro and VIP plans. We provide both spot and futures signals with clear leverage recommendations (usually 2-5x max).</p>
                        </div>

                        <div className="stat-card" style={{ textAlign: 'left', padding: 'var(--space-lg)' }}>
                            <h3 style={{ color: 'var(--color-accent-gold)', marginBottom: '8px' }}>Can I cancel anytime?</h3>
                            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 0 }}>Yes. No contracts, no hidden fees. Cancel anytime from your dashboard. You'll keep access until the end of your billing period.</p>
                        </div>

                        <div className="stat-card" style={{ textAlign: 'left', padding: 'var(--space-lg)' }}>
                            <h3 style={{ color: 'var(--color-accent-gold)', marginBottom: '8px' }}>How are signals delivered?</h3>
                            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 0 }}>Instantly via Telegram and/or Discord. VIP members also get SMS alerts for high-priority signals.</p>
                        </div>

                        <div className="stat-card" style={{ textAlign: 'left', padding: 'var(--space-lg)' }}>
                            <h3 style={{ color: 'var(--color-accent-gold)', marginBottom: '8px' }}>Is this financial advice?</h3>
                            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 0 }}>No. We provide trading signals based on AI analysis. All trading carries risk. Never invest more than you can afford to lose.</p>
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
                        © 2025 APEX. AI-Powered Crypto Trading Signals.
                    </div>
                </div>
            </footer>
        </div >
    );
}

export default App;