import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import './UserProfile.css';

function UserProfile({ user, onClose, onRetakeSurvey }) {
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState(user.email);
    const [message, setMessage] = useState('');
    const [preferences, setPreferences] = useState(null);

    useEffect(() => {
        fetchProfile();
        fetchPreferences();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data } = await supabase
                .from('profiles')
                .select('username')
                .eq('id', user.id)
                .single();

            if (data) {
                setUsername(data.username || '');
            }
        } catch (error) {
            console.log('No profile yet');
        }
    };

    const fetchPreferences = async () => {
        try {
            const { data } = await supabase
                .from('user_preferences')
                .select('*')
                .eq('id', user.id)
                .single();

            if (data) {
                setPreferences(data);
            }
        } catch (error) {
            console.log('No preferences yet');
        }
    };

    const updateProfile = async () => {
        setLoading(true);
        setMessage('');

        try {
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    username: username,
                    updated_at: new Date()
                });

            if (error) throw error;
            setMessage('Profile updated!');
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRetakeSurvey = async () => {
        try {
            // Delete existing preferences so user goes through onboarding again
            const { error } = await supabase
                .from('user_preferences')
                .delete()
                .eq('id', user.id);

            if (error) throw error;

            // Force a full page reload to restart the app flow
            window.location.reload();
        } catch (error) {
            setMessage(error.message);
        }
    };

    return (
        <div className="profile-overlay">
            <div className="profile-modal">
                <div className="profile-header">
                    <h2>Your Dashboard</h2>
                    <button onClick={onClose} className="profile-close">
                        ×
                    </button>
                </div>

                {/* Goals Section */}
                <div className="profile-section goals-section">
                    <div className="section-header">
                        <h3>Your Goals</h3>
                        <button onClick={handleRetakeSurvey} className="retake-button">
                            Retake Survey
                        </button>
                    </div>

                    {preferences && (
                        <div>
                            <div className="goal-item">
                                <p className="goal-label">SKILL LEVEL</p>
                                <span className="goal-value skill-level">
                                    {preferences.skill_level}
                                </span>
                            </div>

                            <div className="goal-item">
                                <p className="goal-label">FOCUS AREAS</p>
                                <div className="goal-tags">
                                    {preferences.goals.map((goal) => (
                                        <span key={goal} className="goal-tag">
                                            {goal.replace('_', ' ')}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile Settings */}
                <div className="profile-section">
                    <h3>Profile Settings</h3>

                    <div className="input-group">
                        <label className="input-label">Email</label>
                        <input
                            type="email"
                            value={email}
                            disabled
                            className="profile-input disabled"
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">Username</label>
                        <input
                            type="text"
                            placeholder="Choose a username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="profile-input"
                        />
                    </div>

                    <button
                        onClick={updateProfile}
                        disabled={loading}
                        className="primary-button profile-save"
                    >
                        {loading ? 'Saving...' : 'Save Profile'}
                    </button>

                    {message && (
                        <p className={`profile-message ${message.includes('updated') ? 'success' : 'error'}`}>
                            {message}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default UserProfile;