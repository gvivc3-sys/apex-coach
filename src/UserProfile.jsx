import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import './App.css';

/**
 * UserProfile component
 *
 * This version ties into the redesigned CSS by using
 * our colour variables and buttons. The logic remains the same as
 * the original implementation.
 */
function UserProfile({ user, onClose }) {
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState(user.email);
    const [message, setMessage] = useState('');
    const [preferences, setPreferences] = useState(null);
    const [editingGoals, setEditingGoals] = useState(false);

    useEffect(() => {
        fetchProfile();
        fetchPreferences();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

    const updateGoals = async () => {
        setLoading(true);
        try {
            const { error } = await supabase
                .from('user_preferences')
                .update({
                    goals: preferences.goals,
                    monthly_target: preferences.monthly_target,
                    skill_level: preferences.skill_level
                })
                .eq('id', user.id);

            if (error) throw error;
            setEditingGoals(false);
            setMessage('Goals updated!');
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleGoal = (goal) => {
        setPreferences((prev) => ({
            ...prev,
            goals: prev.goals.includes(goal)
                ? prev.goals.filter((g) => g !== goal)
                : [...prev.goals, goal]
        }));
    };

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2000
            }}
        >
            <div
                style={{
                    background: 'var(--color-card-bg)',
                    border: '1px solid var(--color-border)',
                    padding: '40px',
                    maxWidth: '600px',
                    width: '90%',
                    maxHeight: '80vh',
                    overflow: 'auto'
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '30px'
                    }}
                >
                    <h2>Your Dashboard</h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--color-text-secondary)',
                            fontSize: '24px',
                            cursor: 'pointer'
                        }}
                    >
                        ×
                    </button>
                </div>

                {/* Goals Section */}
                <div
                    style={{
                        marginBottom: '40px',
                        padding: '20px',
                        background: 'var(--color-card-bg)',
                        border: '1px solid var(--color-border)'
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '20px'
                        }}
                    >
                        <h3 style={{ margin: 0 }}>Your Goals</h3>
                        <button
                            onClick={() => setEditingGoals(!editingGoals)}
                            style={{
                                background: 'transparent',
                                border: `1px solid var(--color-border)`,
                                color: 'var(--color-text-secondary)',
                                padding: '5px 15px',
                                cursor: 'pointer',
                                fontSize: '12px'
                            }}
                        >
                            {editingGoals ? 'Cancel' : 'Edit'}
                        </button>
                    </div>

                    {preferences && (
                        <div>
                            <div style={{ marginBottom: '20px' }}>
                                <p
                                    style={{
                                        color: 'var(--color-text-secondary)',
                                        fontSize: '12px',
                                        marginBottom: '5px'
                                    }}
                                >
                                    TARGET
                                </p>
                                <h3
                                    style={{ margin: 0, color: 'var(--color-accent-gold)' }}
                                >
                                    ${parseInt(preferences.monthly_target).toLocaleString()}/month
                                </h3>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <p
                                    style={{
                                        color: 'var(--color-text-secondary)',
                                        fontSize: '12px',
                                        marginBottom: '10px'
                                    }}
                                >
                                    SKILL LEVEL
                                </p>
                                {editingGoals ? (
                                    <select
                                        value={preferences.skill_level}
                                        onChange={(e) =>
                                            setPreferences((prev) => ({
                                                ...prev,
                                                skill_level: e.target.value
                                            }))
                                        }
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            background: 'var(--color-card-bg)',
                                            border: '1px solid var(--color-border)',
                                            color: 'var(--color-text-primary)',
                                            textTransform: 'capitalize'
                                        }}
                                    >
                                        <option value="beginner">Beginner</option>
                                        <option value="intermediate">Intermediate</option>
                                        <option value="advanced">Advanced</option>
                                    </select>
                                ) : (
                                    <span style={{ textTransform: 'capitalize' }}>
                                        {preferences.skill_level}
                                    </span>
                                )}
                            </div>

                            <div>
                                <p
                                    style={{
                                        color: 'var(--color-text-secondary)',
                                        fontSize: '12px',
                                        marginBottom: '10px'
                                    }}
                                >
                                    FOCUS AREAS
                                </p>
                                {editingGoals ? (
                                    <div>
                                        {[
                                            'dropshipping',
                                            'affiliate',
                                            'digital_products',
                                            'flipping',
                                            'content',
                                            'freelancing',
                                            'amazon_fba',
                                            'print_on_demand'
                                        ].map((goal) => (
                                            <label
                                                key={goal}
                                                style={{
                                                    display: 'block',
                                                    marginBottom: '10px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={preferences.goals.includes(goal)}
                                                    onChange={() => toggleGoal(goal)}
                                                    style={{ marginRight: '10px' }}
                                                />
                                                <span style={{ textTransform: 'capitalize' }}>
                                                    {goal.replace('_', ' ')}
                                                </span>
                                            </label>
                                        ))}
                                        <button
                                            onClick={updateGoals}
                                            className="primary-button"
                                            style={{ width: '100%', marginTop: '20px' }}
                                            disabled={loading}
                                        >
                                            Save Goals
                                        </button>
                                    </div>
                                ) : (
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: '10px'
                                        }}
                                    >
                                        {preferences.goals.map((goal) => (
                                            <span
                                                key={goal}
                                                style={{
                                                    background: 'var(--color-card-bg)',
                                                    padding: '5px 15px',
                                                    border: '1px solid var(--color-border)',
                                                    fontSize: '12px',
                                                    textTransform: 'capitalize',
                                                    color: 'var(--color-text-secondary)'
                                                }}
                                            >
                                                {goal.replace('_', ' ')}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile Settings */}
                <div style={{ marginBottom: '30px' }}>
                    <h3>Profile Settings</h3>
                    <label
                        style={{
                            display: 'block',
                            marginBottom: '10px',
                            color: 'var(--color-text-secondary)'
                        }}
                    >
                        Email
                    </label>
                    <input
                        type="email"
                        value={email}
                        disabled
                        style={{
                            width: '100%',
                            padding: '15px',
                            background: 'var(--color-card-bg)',
                            border: '1px solid var(--color-border)',
                            color: 'var(--color-text-secondary)',
                            fontSize: '16px',
                            opacity: 0.7
                        }}
                    />
                </div>

                <div style={{ marginBottom: '30px' }}>
                    <label
                        style={{
                            display: 'block',
                            marginBottom: '10px',
                            color: 'var(--color-text-secondary)'
                        }}
                    >
                        Username
                    </label>
                    <input
                        type="text"
                        placeholder="Choose a username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '15px',
                            background: 'var(--color-card-bg)',
                            border: '1px solid var(--color-border)',
                            color: 'var(--color-text-primary)',
                            fontSize: '16px'
                        }}
                    />
                </div>

                <button
                    onClick={updateProfile}
                    disabled={loading}
                    className="primary-button"
                    style={{ width: '100%', marginBottom: '20px' }}
                >
                    {loading ? 'Saving...' : 'Save Profile'}
                </button>

                {message && (
                    <p
                        style={{
                            marginTop: '20px',
                            color: message.includes('updated')
                                ? 'var(--color-accent-gold)'
                                : 'var(--color-accent-red)',
                            textAlign: 'center'
                        }}
                    >
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}

export default UserProfile;