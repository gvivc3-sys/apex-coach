import './App.css';
function Success() {
    return (
        <div className="apex-app">
            {/* Navigation */}
            <nav className="nav-fixed">
                <div className="nav-container">
                    <div className="logo">APEX</div>
                    <div className="nav-links">
                        <a href="/">Home</a>
                        <a href="/#features">Features</a>
                        <a href="/#pricing">Pricing</a>
                    </div>
                </div>
            </nav>

            {/* Success Hero */}
            <section className="hero hero-full">
                <div className="hero-content">
                    <div className="hero-emoji">🚀</div>
                    <h1 className="hero-title">
                        WELCOME TO<br />
                        <span className="accent">THE ELITE</span>
                    </h1>
                    <p className="hero-subtitle hero-subtitle-large">
                        Your journey to internet money starts NOW.
                    </p>

                    <div className="success-box">
                        <h2 className="success-title">
                            ✓ Payment Successful!
                        </h2>
                        <p className="success-desc">
                            Check your email for login details. Your first daily tasks are already waiting.
                        </p>

                        <h3 className="success-next">What Happens Next:</h3>
                        <ul className="success-list">
                            <li>
                                📧 <strong>Instant:</strong> Welcome email with your login
                            </li>
                            <li>
                                💰 <strong>Next 24 hours:</strong> Your first money-making task
                            </li>
                            <li>
                                📈 <strong>Day 7:</strong> Your first $100 milestone
                            </li>
                            <li>
                                🎯 <strong>Day 30:</strong> $1K-$10K revenue goal
                            </li>
                        </ul>

                        <div className="success-btn-wrap">
                            <button
                                className="primary-button"
                                onClick={() => alert('Coach dashboard coming soon! Check your email for access.')}
                            >
                                ACCESS YOUR DASHBOARD
                            </button>
                        </div>
                    </div>

                    <p className="success-support">
                        Questions? Email support@apexcoach.com
                    </p>
                </div>
            </section>
        </div>
    );
}

export default Success;