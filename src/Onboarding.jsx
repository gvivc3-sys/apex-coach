import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import Header from './Header';
import './Onboarding.css';

function Onboarding({ user, onComplete }) {
    const [step, setStep] = useState(1);
    const [preferences, setPreferences] = useState({
        skill_level: '',
        goals: [],
        hours_available: '',
        current_income: '',
        strengths: ''
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleSubmit = async () => {
        try {
            console.log('Saving preferences:', preferences);

            const { data, error } = await supabase
                .from('user_preferences')
                .upsert({
                    id: user.id,
                    skill_level: preferences.skill_level,
                    goals: preferences.goals,
                    hours_available: 20,
                    current_income: 0,
                    strengths: preferences.strengths || ''
                });

            if (error) {
                console.error('Supabase error:', error);
                throw error;
            }

            onComplete();
        } catch (error) {
            console.error('Error saving preferences:', error);
            alert(`Error: ${error.message}`);
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
        <div className="apex-app">
            <Header user={user} />

            <div className="onboarding-container">
                <div className="onboarding-card">
                    <h1 className="onboarding-title">
                        Welcome to <span className="accent">APEX</span>
                    </h1>
                    <p className="onboarding-subtitle">
                        Let's customize your journey to internet money
                    </p>

                    {step === 1 && (
                        <div className="onboarding-step">
                            <h3 className="step-title">What's your experience level?</h3>
                            {['beginner', 'intermediate', 'advanced'].map(level => (
                                <button
                                    key={level}
                                    onClick={() => setPreferences(prev => ({ ...prev, skill_level: level }))}
                                    className={`option-button ${preferences.skill_level === level ? 'selected' : ''}`}
                                >
                                    <strong className="option-title">{level}</strong>
                                    <div className="option-description">
                                        {level === 'beginner' && "I've never made money online"}
                                        {level === 'intermediate' && "I've made some money but want to scale"}
                                        {level === 'advanced' && "I'm making money but want to optimize"}
                                    </div>
                                </button>
                            ))}
                            <button
                                className="primary-button onboarding-next"
                                onClick={() => setStep(2)}
                                disabled={!preferences.skill_level}
                            >
                                Next
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="onboarding-step">
                            <h3 className="step-title">What interests you? (Select all)</h3>
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
                                    className={`option-button compact ${preferences.goals.includes(option.id) ? 'selected' : ''}`}
                                >
                                    <strong className="option-title">{option.name}</strong>
                                    <div className="option-description">
                                        {option.desc}
                                    </div>
                                </button>
                            ))}
                            <button
                                className="primary-button onboarding-next"
                                onClick={handleSubmit}
                                disabled={preferences.goals.length === 0}
                            >
                                Start My Journey
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Onboarding;