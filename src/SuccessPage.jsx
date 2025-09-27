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
            <section className="hero" style={{ minHeight: '100vh' }}>
                <div className="hero-content">
                    <div style={{ fontSize: '80px', marginBottom: '30px' }}>🚀</div>
                    <h1 className="hero-title">
                        WELCOME TO<br />
                        <span className="accent">THE ELITE</span>
                    </h1>
                    <p className="hero-subtitle" style={{ marginBottom: '30px' }}>
                        Your journey to internet money starts NOW.
                    </p>

                    <div style={{
                        background: 'linear-gradient(135deg, rgba(20, 20, 20, 0.9), rgba(10, 10, 10, 0.9))',
                        border: '1px solid var(--border-gray)',
                        padding: '40px',
                        maxWidth: '600px',
                        margin: '0 auto',
                        textAlign: 'left'
                    }}>
                        <h2 style={{ marginBottom: '20px', color: 'var(--accent-gold)' }}>
                            ✓ Payment Successful!
                        </h2>
                        <p style={{ marginBottom: '20px', color: 'var(--text-gray)' }}>
                            Check your email for login details. Your first daily tasks are already waiting.
                        </p>

                        <h3 style={{ marginBottom: '15px' }}>What Happens Next:</h3>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li style={{ marginBottom: '10px', color: 'var(--text-gray)' }}>
                                📧 <strong>Instant:</strong> Welcome email with your login
                            </li>
                            <li style={{ marginBottom: '10px', color: 'var(--text-gray)' }}>
                                💰 <strong>Next 24 hours:</strong> Your first money-making task
                            </li>
                            <li style={{ marginBottom: '10px', color: 'var(--text-gray)' }}>
                                📈 <strong>Day 7:</strong> Your first $100 milestone
                            </li>
                            <li style={{ marginBottom: '10px', color: 'var(--text-gray)' }}>
                                🎯 <strong>Day 30:</strong> $1K-$10K revenue goal
                            </li>
                        </ul>

                        <div style={{ marginTop: '30px' }}>
                            <button
                                className="primary-button"
                                style={{ width: '100%' }}
                                onClick={() => alert('Coach dashboard coming soon! Check your email for access.')}
                            >
                                ACCESS YOUR DASHBOARD
                            </button>
                        </div>
                    </div>

                    <p style={{ marginTop: '40px', fontSize: '14px', color: 'var(--text-gray)' }}>
                        Questions? Email support@apexcoach.com
                    </p>
                </div>
            </section>
        </div>
    );
}

export default Success;