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


            <section class="hero">
                <div class="hero-content container">
                    <h1 class="hero-title">
                        Master TikTok Affiliate Marketing<br>
                            <span class="accent">With AI In 72 Hours</span>
                    </h1>
                    <p class="hero-subtitle">
                        Learn the exact system helping beginners generate $1K-$5K/month in TikTok commissions<br>
                            using AI to create viral content—without showing your face or building an audience
                    </p>
                    <div class="hero-cta">
                        <button class="cta-button" onclick="document.getElementById('pricing').scrollIntoView({behavior: 'smooth'})">
                            Start Learning Now
                        </button>
                        <button class="secondary-button" onclick="document.getElementById('demo').scrollIntoView({behavior: 'smooth'})">
                            Watch 3-Min Demo
                        </button>
                    </div>
                </div>
            </section>


            <section class="stats">
                <div class="stats-container">
                    <div class="stat-card">
                        <div class="stat-number">8,400+</div>
                        <div class="stat-label">Active Students</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">$2.3M+</div>
                        <div class="stat-label">Student Commissions</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">7-14</div>
                        <div class="stat-label">Days To First Sale</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">4.9/5</div>
                        <div class="stat-label">Student Rating</div>
                    </div>
                </div>
            </section>


            <section class="features" id="demo">
                <div class="container">
                    <h2 class="section-title">Why Most People Fail At TikTok (And How We Fix It)</h2>
                    <div class="features-grid">
                        <div class="feature-card">
                            <div class="feature-icon">❌</div>
                            <h3 class="feature-title">The Old Way: Build Audience First</h3>
                            <p class="feature-description">
                                Spend 6-12 months growing followers, then figure out how to monetize. Most people quit before making a single dollar.
                            </p>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon">❌</div>
                            <h3 class="feature-title">The Old Way: Be "Creative"</h3>
                            <p class="feature-description">
                                Spend hours brainstorming, scripting, and editing videos. Stare at a blank screen wondering what to post.
                            </p>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon">❌</div>
                            <h3 class="feature-title">The Old Way: Show Your Face</h3>
                            <p class="feature-description">
                                Force yourself on camera even if you're uncomfortable. Let everyone know your identity and business.
                            </p>
                        </div>
                    </div>

                    <h2 class="section-title" style="margin-top: 40px;">The APEX Way: Proven AI System</h2>
                    <div class="features-grid">
                        <div class="feature-card">
                            <div class="feature-icon">✅</div>
                            <h3 class="feature-title">Monetize Day 1</h3>
                            <p class="feature-description">
                                Start promoting products immediately with zero followers. TikTok Shop pushes affiliate content regardless of your audience size.
                            </p>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon">✅</div>
                            <h3 class="feature-title">AI Does The Work</h3>
                            <p class="feature-description">
                                AI generates concepts, scripts, voiceovers, and edits your videos in under 5 minutes. You just post and collect commissions.
                            </p>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon">✅</div>
                            <h3 class="feature-title">Stay Anonymous</h3>
                            <p class="feature-description">
                                Never show your face or use your voice. The "invisible influencer" method lets you build income completely privately.
                            </p>
                        </div>
                    </div>
                </div>
            </section>


            <section class="stats" style="background-color: var(--color-bg);">
                <div class="container" style="max-width: 900px;">
                    <h2 class="section-title">Real Students. Real Results.</h2>
                    <div style="display: grid; gap: 24px; margin-top: 40px;">
                        <div class="contentCard">
                            <h3 style="color: var(--color-accent-gold); margin-bottom: 8px;">"Made $3,200 My First Month. I'm Shocked."</h3>
                            <p style="color: var(--color-text-secondary); margin-bottom: 8px; font-style: italic;">
                                "I was skeptical about the $27 price. Thought it would be some basic garbage. But this is LEGIT. The AI content method is insane. I made my first sale in 11 days. First month total: $3,200. I've already quit my part-time job."
                            </p>
                            <p style="color: var(--color-text-muted); font-size: 14px;">— Marcus T., College Student</p>
                        </div>

                        <div class="contentCard">
                            <h3 style="color: var(--color-accent-gold); margin-bottom: 8px;">"Finally Something That Actually Works"</h3>
                            <p style="color: var(--color-text-secondary); margin-bottom: 8px; font-style: italic;">
                                "I've wasted thousands on courses that promised easy money. All BS. APEX-AFFILIATE is different. It's simple, practical, and it WORKS. I'm making $1,800/month now and I work maybe 45 minutes a day. This is the real deal."
                            </p>
                            <p style="color: var(--color-text-muted); font-size: 14px;">— Jennifer K., Stay-at-Home Mom</p>
                        </div>

                        <div class="contentCard">
                            <h3 style="color: var(--color-accent-gold); margin-bottom: 8px;">"$4,100 Last Month. Never Showed My Face Once."</h3>
                            <p style="color: var(--color-text-secondary); margin-bottom: 8px; font-style: italic;">
                                "I'm a private person. Showing my face online? No thanks. APEX teaches you how to stay completely anonymous. AI makes all my videos. I just post and collect commissions. Made $4,100 last month. This is life-changing."
                            </p>
                            <p style="color: var(--color-text-muted); font-size: 14px;">— David R., Warehouse Worker</p>
                        </div>
                    </div>
                </div>
            </section>


            <section class="features">
                <div class="container">
                    <h2 class="section-title">What You'll Learn Inside APEX-AFFILIATE</h2>
                    <div class="features-grid">
                        <div class="feature-card">
                            <div class="feature-icon">📚</div>
                            <h3 class="feature-title">Module 1: Foundation</h3>
                            <p class="feature-description">
                                How TikTok affiliate marketing works, account setup, profile optimization, and the math behind $5K/month income.
                            </p>
                        </div>

                        <div class="feature-card">
                            <div class="feature-icon">🤖</div>
                            <h3 class="feature-title">Module 2: AI Content System</h3>
                            <p class="feature-description">
                                4-minute video framework, AI prompts for viral concepts, voice AI tools, and batch creation methods. Create 7 days of content in 30 minutes.
                            </p>
                        </div>

                        <div class="feature-card">
                            <div class="feature-icon">💰</div>
                            <h3 class="feature-title">Module 3: Product Selection</h3>
                            <p class="feature-description">
                                Find high-converting products (8-15% rates), avoid losers, seasonal strategies, and competitive research shortcuts.
                            </p>
                        </div>

                        <div class="feature-card">
                            <div class="feature-icon">📈</div>
                            <h3 class="feature-title">Module 4: Algorithm Hacking</h3>
                            <p class="feature-description">
                                Decode the 2025 TikTok algorithm, 7-second hook patterns, optimal posting times, and For You Page triggers.
                            </p>
                        </div>

                        <div class="feature-card">
                            <div class="feature-icon">💵</div>
                            <h3 class="feature-title">Module 5: First Sales</h3>
                            <p class="feature-description">
                                14-day sprint to $500-$1,000, conversion psychology, CTA formulas, and troubleshooting common issues.
                            </p>
                        </div>

                        <div class="feature-card">
                            <div class="feature-icon">📊</div>
                            <h3 class="feature-title">Module 6: Tracking & Optimization</h3>
                            <p class="feature-description">
                                Analytics mastery, A/B testing, scaling from $1K to $5K/month using the multiplication method.
                            </p>
                        </div>

                        <div class="feature-card">
                            <div class="feature-icon">⚡</div>
                            <h3 class="feature-title">Module 7: Advanced Strategies</h3>
                            <p class="feature-description">
                                Multiple accounts, automation tools, brand sponsorships, and the $10K/month roadmap.
                            </p>
                        </div>

                        <div class="feature-card">
                            <div class="feature-icon">🛡️</div>
                            <h3 class="feature-title">Module 8: Risk Management</h3>
                            <p class="feature-description">
                                TikTok terms of service, avoiding shadowbans, handling competitors, and legal/tax basics.
                            </p>
                        </div>
                    </div>
                </div>
            </section>


            <section class="stats">
                <div class="container" style="max-width: 900px;">
                    <h2 class="section-title">Exclusive Bonuses Included</h2>
                    <div style="display: grid; gap: 16px; margin-top: 40px;">
                        <div class="stat-card" style="text-align: left;">
                            <h3 style="font-size: 18px; margin-bottom: 8px; color: var(--color-accent-gold);">🎁 The Viral Hook Library ($47 Value)</h3>
                            <p style="color: var(--color-text-secondary); font-size: 14px;">200+ proven hooks for any niche. Never stare at a blank screen again.</p>
                        </div>

                        <div class="stat-card" style="text-align: left;">
                            <h3 style="font-size: 18px; margin-bottom: 8px; color: var(--color-accent-gold);">🎁 Product Vault ($67 Value)</h3>
                            <p style="color: var(--color-text-secondary); font-size: 14px;">300+ pre-researched high-converting products with commission rates and examples.</p>
                        </div>

                        <div class="stat-card" style="text-align: left;">
                            <h3 style="font-size: 18px; margin-bottom: 8px; color: var(--color-accent-gold);">🎁 AI Prompt Cheat Sheet ($37 Value)</h3>
                            <p style="color: var(--color-text-secondary); font-size: 14px;">Copy/paste prompts for ChatGPT, Claude, and other AI tools. Instant viral content.</p>
                        </div>

                        <div class="stat-card" style="text-align: left;">
                            <h3 style="font-size: 18px; margin-bottom: 8px; color: var(--color-accent-gold);">🎁 First $1K Roadmap ($77 Value)</h3>
                            <p style="color: var(--color-text-secondary); font-size: 14px;">Day-by-day action plan for your first 30 days. Sales by week 2 guaranteed.</p>
                        </div>

                        <div class="stat-card" style="text-align: left;">
                            <h3 style="font-size: 18px; margin-bottom: 8px; color: var(--color-accent-gold);">🎁 TikTok Trends Calendar ($47 Value)</h3>
                            <p style="color: var(--color-text-secondary); font-size: 14px;">Monthly updates on trending products and content styles. Stay ahead of the curve.</p>
                        </div>
                    </div>
                    <p style="text-align: center; margin-top: 24px; font-size: 20px; color: var(--color-text-primary);">
                        <strong>Total Bonus Value: $275</strong>
                    </p>
                </div>
            </section>


            <section class="pricing" id="pricing">
                <div class="pricing-container">
                    <h2 class="section-title">Choose Your Path To $5K/Month</h2>
                    <p style="text-align: center; color: var(--color-text-secondary); margin-bottom: 40px; max-width: 700px; margin-left: auto; margin-right: auto;">
                        All tiers include the complete 8-module course, all bonuses, and lifetime access. The only difference? How many AI conversations you get with our intelligent assistant to help you succeed faster.
                    </p>

                    <div class="pricing-grid">

                        <div class="pricing-card">
                            <div class="pricing-tier">Starter</div>
                            <div class="pricing-amount">$27</div>
                            <div class="pricing-period">One-time payment</div>
                            <ul class="pricing-features">
                                <li>✅ Complete 8-Module Course</li>
                                <li>✅ All 5 Exclusive Bonuses</li>
                                <li>✅ Lifetime Access + Updates</li>
                                <li>✅ 40-50 AI Conversations</li>
                                <li>✅ 200-250 AI Questions</li>
                                <li>✅ 30-Day Money Back Guarantee</li>
                            </ul>
                            <button class="cta-button">Start With Starter</button>
                            <p style="margin-top: 12px; font-size: 12px; color: var(--color-text-muted);">Perfect for testing the system</p>
                        </div>


                        <div class="pricing-card featured">
                            <div class="pricing-tier">Hustler</div>
                            <div class="pricing-amount">$47</div>
                            <div class="pricing-period">One-time payment</div>
                            <ul class="pricing-features">
                                <li>✅ Complete 8-Module Course</li>
                                <li>✅ All 5 Exclusive Bonuses</li>
                                <li>✅ Lifetime Access + Updates</li>
                                <li>✅ 80-100 AI Conversations</li>
                                <li>✅ 400-500 AI Questions</li>
                                <li>✅ 30-Day Money Back Guarantee</li>
                                <li>🔥 Priority Support</li>
                            </ul>
                            <button class="cta-button">Get Hustler Access</button>
                            <p style="margin-top: 12px; font-size: 12px; color: var(--color-text-muted);">Best value for serious learners</p>
                        </div>


                        <div class="pricing-card">
                            <div class="pricing-tier">Empire</div>
                            <div class="pricing-amount">$67</div>
                            <div class="pricing-period">One-time payment</div>
                            <ul class="pricing-features">
                                <li>✅ Complete 8-Module Course</li>
                                <li>✅ All 5 Exclusive Bonuses</li>
                                <li>✅ Lifetime Access + Updates</li>
                                <li>✅ 120-150 AI Conversations</li>
                                <li>✅ 600-750 AI Questions</li>
                                <li>✅ 30-Day Money Back Guarantee</li>
                                <li>🔥 Priority Support</li>
                                <li>🔥 Advanced Strategy Sessions</li>
                            </ul>
                            <button class="cta-button">Unlock Empire</button>
                            <p style="margin-top: 12px; font-size: 12px; color: var(--color-text-muted);">Maximum support for scaling to $10K+</p>
                        </div>
                    </div>

                    <div style="text-align: center; margin-top: 40px; padding: 24px; background: var(--color-card-bg); border-radius: var(--radius-md); border: 1px solid var(--color-border); max-width: 700px; margin-left: auto; margin-right: auto;">
                        <h3 style="color: var(--color-accent-gold); margin-bottom: 12px;">🔒 30-Day Money-Back Guarantee</h3>
                        <p style="color: var(--color-text-secondary); margin-bottom: 0; font-size: 14px;">
                            Try APEX-AFFILIATE risk-free for 30 days. If you're not satisfied for any reason, we'll refund every penny. No questions asked.
                        </p>
                    </div>
                </div>
            </section>

            <section class="features">
                <div class="container">
                    <h2 class="section-title">Why APEX-AFFILIATE Works When Others Fail</h2>
                    <div class="features-grid">
                        <div class="feature-card">
                            <div class="feature-icon">🎯</div>
                            <h3 class="feature-title">Beginner-Friendly</h3>
                            <p class="feature-description">
                                Zero experience required. If you can scroll TikTok and check email, you can do this. Everything explained step-by-step.
                            </p>
                        </div>

                        <div class="feature-card">
                            <div class="feature-icon">⚡</div>
                            <h3 class="feature-title">Fast Results</h3>
                            <p class="feature-description">
                                Most students see their first sale within 7-14 days. First $1,000 typically happens within 30-45 days of consistent work.
                            </p>
                        </div>

                        <div class="feature-card">
                            <div class="feature-icon">🚀</div>
                            <h3 class="feature-title">AI-Powered</h3>
                            <p class="feature-description">
                                AI does 90% of the heavy lifting. Content creation that used to take hours now takes 5 minutes. Work smarter, not harder.
                            </p>
                        </div>

                        <div class="feature-card">
                            <div class="feature-icon">💰</div>
                            <h3 class="feature-title">Low Risk</h3>
                            <p class="feature-description">
                                No inventory, no shipping, no customer service. Just content creation and commissions. Start with zero capital beyond the course.
                            </p>
                        </div>

                        <div class="feature-card">
                            <div class="feature-icon">📱</div>
                            <h3 class="feature-title">Platform Independent</h3>
                            <p class="feature-description">
                                While focused on TikTok, the same strategies work on Instagram Reels, YouTube Shorts, and any short-form video platform.
                            </p>
                        </div>

                        <div class="feature-card">
                            <div class="feature-icon">🔄</div>
                            <h3 class="feature-title">Scalable System</h3>
                            <p class="feature-description">
                                Start at $1K/month, scale to $5K, then $10K+. The system grows with you through multiple accounts and automation.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- FAQ -->
            <section class="stats">
                <div class="container" style="max-width: 900px;">
                    <h2 class="section-title">Frequently Asked Questions</h2>
                    <div style="display: grid; gap: 16px; margin-top: 40px;">
                        <div class="contentCard">
                            <h3 style="color: var(--color-accent-gold); margin-bottom: 8px;">Do I need to show my face or use my voice?</h3>
                            <p style="color: var(--color-text-secondary); margin-bottom: 0;">Absolutely not. The "invisible influencer" method lets you stay 100% anonymous. AI handles voices, you never appear on camera.</p>
                        </div>

                        <div class="contentCard">
                            <h3 style="color: var(--color-accent-gold); margin-bottom: 8px;">How much time does this take?</h3>
                            <p style="color: var(--color-text-secondary); margin-bottom: 0;">Initial setup: 2-3 hours. Daily maintenance: 30-60 minutes. You can batch-create content on weekends and post during the week.</p>
                        </div>

                        <div class="contentCard">
                            <h3 style="color: var(--color-accent-gold); margin-bottom: 8px;">Do I need followers to make money?</h3>
                            <p style="color: var(--color-text-secondary); margin-bottom: 0;">No. TikTok Shop content gets pushed regardless of follower count. Students make sales with 0-100 followers all the time.</p>
                        </div>

                        <div class="contentCard">
                            <h3 style="color: var(--color-accent-gold); margin-bottom: 8px;">What's the difference between the tiers?</h3>
                            <p style="color: var(--color-text-secondary); margin-bottom: 0;">All tiers include the complete course and bonuses. The only difference is AI conversation limits. Starter gives you 40-50 conversations to get help, Hustler gives 80-100, and Empire gives 120-150 for maximum support.</p>
                        </div>

                        <div class="contentCard">
                            <h3 style="color: var(--color-accent-gold); margin-bottom: 8px;">Is there a monthly fee?</h3>
                            <p style="color: var(--color-text-secondary); margin-bottom: 0;">No. One-time payment. Lifetime access. No hidden fees. Ever.</p>
                        </div>

                        <div class="contentCard">
                            <h3 style="color: var(--color-accent-gold); margin-bottom: 8px;">How fast can I see results?</h3>
                            <p style="color: var(--color-text-secondary); margin-bottom: 0;">Most students get their first sale within 7-14 days. First $1,000 typically happens within 30-45 days if you're consistent.</p>
                        </div>

                        <div class="contentCard">
                            <h3 style="color: var(--color-accent-gold); margin-bottom: 8px;">What if TikTok gets banned?</h3>
                            <p style="color: var(--color-text-secondary); margin-bottom: 0;">The same strategies work on Instagram Reels, YouTube Shorts, and any short-form video platform. Plus you keep the AI skills forever.</p>
                        </div>

                        <div class="contentCard">
                            <h3 style="color: var(--color-accent-gold); margin-bottom: 8px;">Is this a "get rich quick" scheme?</h3>
                            <p style="color: var(--color-text-secondary); margin-bottom: 0;">No. This requires work. You need to create content, post consistently, and learn as you go. But the system is proven and the results are real.</p>
                        </div>
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