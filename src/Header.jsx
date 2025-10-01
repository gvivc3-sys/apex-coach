import { supabase } from './supabase';
import './App.css';

function Header({ user, showProfile, setShowProfile }) {
    const handleSignOut = async () => {
        await supabase.auth.signOut();
        // Force a full page reload to clear everything
        window.location.replace(window.location.origin);
    };

    return (
        <nav className="nav-fixed">
            <div className="nav-container">
                <div className="logo"><a href="/">APEX</a></div>
                <div className="nav-links">
                    {user ? (
                        <>
                            <button
                                onClick={() => setShowProfile && setShowProfile(true)}
                                style={{
                                    background: 'transparent',
                                    border: '1px solid var(--border-gray)',
                                    color: 'var(--text-white)',
                                    padding: '8px 16px',
                                    cursor: 'pointer',
                                    marginRight: '10px'
                                }}
                            >
                                {user.email.split('@')[0]}
                            </button>
                            <button className="cta-button" onClick={handleSignOut}>
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <>
                            <a href="#features">Features</a>
                            <a href="#pricing">Pricing</a>
                            <button
                                className="secondary-button"
                                style={{ marginRight: '10px', padding: '12px 30px' }}
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
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Header;