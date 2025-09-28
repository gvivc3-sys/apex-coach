import { useState } from 'react';
import { supabase } from './supabase';
import './App.css';

function Onboarding({ user, onComplete }) {
    const [step, setStep] = useState(1);
    const [preferences, setPreferences] = useState({
        skill_level: '',
        goals: [],
        monthly_target: '',
        hours_available: '',
        current_income: '',
        strengths: ''
    });

    const handleSubmit = async () => {
        try {
            const { error } = await supabase
                .from('user_preferences')
                .upsert({
                    id: user.id,
                    ...preferences
                });

            if (error) throw error;
            onComplete();
        } catch (error) {
            console.error('Error saving preferences:', error);
        }
    };

    const toggleGoal = (goal) => {
        setPreferences(prev => ({
            ...prev,
            goals: prev.goals.includes(goal)
                ? prev.goals.filter(g => g !== goal)
                : [...prev.goals, goal]
        }));
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--primary-black)'
        }}>
            <div style={{
                maxWidth: '600px',
                width: '90%',
                padding: '40px',
                background: 'var(--secondary-black)',
                border: '1px solid var(--border-gray)'
            }}>
                <h1 style={{ marginBottom: '10px' }}>
                    Welcome to <span className="accent">APEX</span>
                </h1>
                <p style={{ color: 'var(--text-gray)', marginBottom: '40px' }}>
                    Let's customize your journey to internet money
                </p>

                {step === 1 && (
                    <div>
                        <h3 style={{ marginBottom: '20px' }}>What's your experience level?</h3>
                        {['beginner', 'intermediate', 'advanced'].map(level => (
                            <button
                                key={level}
                                onClick={() => setPreferences(prev => ({ ...prev, skill_level: level }))}
                                style={{
                                    display: 'block',
                                    width: '100%',
                                    padding: '20px',
                                    marginBottom: '15px',
                                    background: preferences.skill_level === level
                                        ? 'linear-gradient(45deg, var(--accent-red), var(--accent-gold))'
                                        : 'var(--primary-black)',
                                    border: '1px solid var(--border-gray)',
                                    color: 'white',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    textTransform: 'capitalize'
                                }}
                            >
                                <strong>{level}</strong>
                                <div style={{ fontSize: '12px', marginTop: '5px', opacity: 0.8 }}>
                                    {level === 'beginner' && "I've never made money online"}
                                    {level === 'intermediate' && "I've made some money but want to scale"}
                                    {level === 'advanced' && "I'm making money but want to optimize"}
                                </div>
                            </button>
                        ))}
                        <button
                            className="primary-button"
                            style={{ width: '100%', marginTop: '20px' }}
                            onClick={() => setStep(2)}
                            disabled={!preferences.skill_level}
                        >
                            Next
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <h3 style={{ marginBottom: '20px' }}>What interests you? (Select all)</h3>
                        {[
                            { id: 'dropshipping', name: 'Dropshipping', desc: 'Sell products without inventory' },
                            { id: 'affiliate', name: 'Affiliate Marketing', desc: 'Earn commissions promoting products' },
                            { id: 'digital_products', name: 'Digital Products', desc: 'Create and sell info products' },
                            { id: 'flipping', name: 'Flipping', desc: 'Buy low, sell high' },
                            { id: 'content', name: 'Content Creation', desc: 'YouTube, TikTok, blogging' },
                            { id: 'freelancing', name: 'Freelancing', desc: 'Sell your skills' },
                            { id: 'amazon_fba', name: 'Amazon FBA', desc: 'Sell on Amazon' },
                            { id: 'print_on_demand', name: 'Print on Demand', desc: 'Custom merchandise' }
                        ].map(option => (
                            <button
                                key={option.id}
                                onClick={() => toggleGoal(option.id)}
                                style={{
                                    display: 'block',
                                    width: '100%',
                                    padding: '15px',
                                    marginBottom: '10px',
                                    background: preferences.goals.includes(option.id)
                                        ? 'linear-gradient(45deg, var(--accent-red), var(--accent-gold))'
                                        : 'var(--primary-black)',
                                    border: '1px solid var(--border-gray)',
                                    color: 'white',
                                    cursor: 'pointer',
                                    textAlign: 'left'
                                }}
                            >
                                <strong>{option.name}</strong>
                                <div style={{ fontSize: '12px', marginTop: '3px', opacity: 0.8 }}>
                                    {option.desc}
                                </div>
                            </button>
                        ))}
                        <button
                            className="primary-button"
                            style={{ width: '100%', marginTop: '20px' }}
                            onClick={() => setStep(3)}
                            disabled={preferences.goals.length === 0}
                        >
                            Next
                        </button>
                    </div>
                )}

                {step === 3 && (
                    <div>
                        <h3 style={{ marginBottom: '20px' }}>Monthly income goal?</h3>
                        {['1000', '5000', '10000', '25000'].map(amount => (
                            <button
                                key={amount}
                                onClick={() => setPreferences(prev => ({ ...prev, monthly_target: amount }))}
                                style={{
                                    display: 'block',
                                    width: '100%',
                                    padding: '20px',
                                    marginBottom: '15px',
                                    background: preferences.monthly_target === amount
                                        ? 'linear-gradient(45deg, var(--accent-red), var(--accent-gold))'
                                        : 'var(--primary-black)',
                                    border: '1px solid var(--border-gray)',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontSize: '18px',
                                    fontWeight: 'bold'
                                }}
                            >
                                ${parseInt(amount).toLocaleString()}/month
                            </button>
                        ))}
                        <button
                            className="primary-button"
                            style={{ width: '100%', marginTop: '20px' }}
                            onClick={handleSubmit}
                            disabled={!preferences.monthly_target}
                        >
                            Start My Journey
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Onboarding;