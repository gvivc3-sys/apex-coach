import { supabase } from './supabase';
import './App.css';

function Header({ user, showProfile, setShowProfile }) {
    const handleSignOut = async () => {
        await supabase.auth.signOut();
        window.location.replace(window.location.origin);
    };

    return (
        <nav className="nav-fixed">
            <div className="nav-container">
                <a href="/" className="logo">APEX</a>
                <div className="nav-links">
                    {user ? (
                        <>
                            <button
                                className="user-button"
                                onClick={() => setShowProfile && setShowProfile(true)}
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