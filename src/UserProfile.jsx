import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import Header from './Header';
import './UserProfile.css';

function UserProfile({ user, onBack }) {
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
            // Delete preferences
            const { error: prefError } = await supabase
                .from('user_preferences')
                .delete()
                .eq('id', user.id);

            if (prefError) throw prefError;

            // Delete chat history so fresh welcome message appears
            await supabase
                .from('chat_messages')
                .delete()
                .eq('user_id', user.id);

            window.location.reload();
        } catch (error) {
            setMessage(error.message);
        }
    };

    return (
        <div className="apex-app">
            <Header user={user} />

            <div className="profile-page">
                <div className="profile-container">
                    <div className="profile-header-page">
                        <button onClick={onBack} className="back-button">
                            ← Back to Dashboard
                        </button>
                        <h1>Your Profile</h1>
                    </div>

                    {/* Demographics Section */}
                    {preferences && (
                        <div className="profile-section">
                            <h3>About You</h3>

                            <div className="demographics-grid">
                                {preferences.age && (
                                    <div className="demo-item">
                                        <p className="goal-label">Age</p>
                                        <span className="goal-value">{preferences.age}</span>
                                    </div>
                                )}

                                {preferences.country && (
                                    <div className="demo-item">
                                        <p className="goal-label">Location</p>
                                        <span className="goal-value">{getCountryName(preferences.country)}</span>
                                    </div>
                                )}

                                {preferences.is_student !== null && (
                                    <div className="demo-item">
                                        <p className="goal-label">Student Status</p>
                                        <span className="goal-value">
                                            {preferences.is_student ? 'Student' : 'Not a student'}
                                        </span>
                                    </div>
                                )}

                                {preferences.skills && (
                                    <div className="demo-item full-width">
                                        <p className="goal-label">Skills & Interests</p>
                                        <span className="goal-value">{preferences.skills}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Goals Section */}
                    {preferences && (
                        <div className="profile-section">
                            <div className="section-header">
                                <h3>Your Goals</h3>
                                <button onClick={handleRetakeSurvey} className="retake-button">
                                    Retake Survey
                                </button>
                            </div>

                            <div>
                                <div className="goal-item">
                                    <p className="goal-label">Experience Level</p>
                                    <span className="goal-value skill-level">
                                        {preferences.skill_level}
                                    </span>
                                </div>

                                <div className="goal-item">
                                    <p className="goal-label">Focus Areas</p>
                                    <div className="goal-tags">
                                        {preferences.goals.map((goal) => (
                                            <span key={goal} className="goal-tag">
                                                {goal.replace('_', ' ')}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Profile Settings */}
                    <div className="profile-section">
                        <h3>Account Settings</h3>

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
        </div>
    );
}

export default UserProfile;