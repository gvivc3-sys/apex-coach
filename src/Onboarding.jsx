import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import Header from './Header';
import './Onboarding.css';

function Onboarding({ user, onComplete }) {
    const [step, setStep] = useState(1);
    const [preferences, setPreferences] = useState({
        age: '',
        location: '',
        is_student: null,
        country: '',
        skills: '',
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
        if (!user || !user.id) {
            console.error('No user found');
            return;
        }

        try {
            // Build preferences object, only including non-empty values
            const preferencesData = {
                id: user.id,
                goals: preferences.goals,
                skill_level: preferences.skill_level || null,
                skills: preferences.skills || null,
                location: preferences.location || null,
                country: preferences.country || null,
                strengths: preferences.strengths || null
            };

            // Only add integer/boolean fields if they have actual values
            if (preferences.age && preferences.age !== '') {
                preferencesData.age = parseInt(preferences.age);
            }
            if (preferences.hours_available && preferences.hours_available !== '') {
                preferencesData.hours_available = parseInt(preferences.hours_available);
            }
            if (preferences.current_income && preferences.current_income !== '') {
                preferencesData.current_income = parseFloat(preferences.current_income);
            }
            if (preferences.is_student !== null) {
                preferencesData.is_student = preferences.is_student;
            }

            const { error: prefError } = await supabase
                .from('user_preferences')
                .upsert(preferencesData);

            if (prefError) throw prefError;

            const { data: existingUsage } = await supabase
                .from('user_usage')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (!existingUsage) {
                await supabase
                    .from('user_usage')
                    .insert({
                        user_id: user.id,
                        subscription_tier: 'starter',
                        tokens_used: 0,
                        tokens_limit: 100000,
                        period_start: new Date().toISOString(),
                        period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
                    });
            }

            onComplete();
        } catch (error) {
            console.error('Error saving preferences:', error);
            alert('Error saving preferences: ' + error.message);
        }
    };

    try {
        // Build preferences object, only including non-empty values
        const preferencesData = {
            id: user.id,
            goals: preferences.goals,
            skill_level: preferences.skill_level || null,
            skills: preferences.skills || null,
            location: preferences.location || null,
            country: preferences.country || null,
            strengths: preferences.strengths || null
        };

        // Only add integer/boolean fields if they have actual values
        if (preferences.age && preferences.age !== '') {
            preferencesData.age = parseInt(preferences.age);
        }
        if (preferences.hours_available && preferences.hours_available !== '') {
            preferencesData.hours_available = parseInt(preferences.hours_available);
        }
        if (preferences.current_income && preferences.current_income !== '') {
            preferencesData.current_income = parseFloat(preferences.current_income);
        }
        if (preferences.is_student !== null) {
            preferencesData.is_student = preferences.is_student;
        }

        const { error: prefError } = await supabase
            .from('user_preferences')
            .upsert(preferencesData);

        if (prefError) throw prefError;

        const { data: existingUsage } = await supabase
            .from('user_usage')
            .select('*')
            .eq('user_id', user.id)
            .single();

        if (!existingUsage) {
            await supabase
                .from('user_usage')
                .insert({
                    user_id: user.id,
                    subscription_tier: 'starter',
                    tokens_used: 0,
                    tokens_limit: 100000,
                    period_start: new Date().toISOString(),
                    period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
                });
        }

        onComplete();
    } catch (error) {
        console.error('Error saving preferences:', error);
        alert('Error saving preferences: ' + error.message);
    }
};
    };

    const toggleGoal = (goal) => {
        setPreferences(prev => ({
            ...prev,
            goals: prev.goals.includes(goal)
                ? prev.goals.filter(g => g !== goal)
                : [...prev.goals, goal]
        }));
    };

    const commonCountries = [
        { code: 'US', name: 'United States', flag: '🇺🇸' },
        { code: 'CA', name: 'Canada', flag: '🇨🇦' },
        { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
        { code: 'AU', name: 'Australia', flag: '🇦🇺' },
        { code: 'IN', name: 'India', flag: '🇮🇳' },
        { code: 'OTHER', name: 'Other', flag: '🌍' }
    ];

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

                    {/* Step 1: Age */}
                    {step === 1 && (
                        <div className="onboarding-step">
                            <h3 className="step-title">How old are you?</h3>
                            <input
                                type="number"
                                min="13"
                                max="100"
                                placeholder="Enter your age"
                                value={preferences.age}
                                onChange={(e) => setPreferences(prev => ({ ...prev, age: e.target.value }))}
                                className="age-input"
                            />
                            <button
                                className="primary-button onboarding-next"
                                onClick={() => setStep(2)}
                                disabled={!preferences.age || preferences.age < 13}
                            >
                                Next
                            </button>
                        </div>
                    )}

                    {/* Step 2: Country */}
                    {step === 2 && (
                        <div className="onboarding-step">
                            <h3 className="step-title">Where do you live?</h3>
                            <div className="country-grid">
                                {commonCountries.map(country => (
                                    <button
                                        key={country.code}
                                        onClick={() => setPreferences(prev => ({ ...prev, country: country.code }))}
                                        className={`option-button country-button ${preferences.country === country.code ? 'selected' : ''}`}
                                    >
                                        <span className="country-flag">{country.flag}</span>
                                        <strong className="option-title">{country.name}</strong>
                                    </button>
                                ))}
                            </div>
                            <button
                                className="primary-button onboarding-next"
                                onClick={() => setStep(3)}
                                disabled={!preferences.country}
                            >
                                Next
                            </button>
                        </div>
                    )}

                    {/* Step 3: Student Status */}
                    {step === 3 && (
                        <div className="onboarding-step">
                            <h3 className="step-title">Are you currently a student?</h3>
                            <button
                                onClick={() => setPreferences(prev => ({ ...prev, is_student: true }))}
                                className={`option-button ${preferences.is_student === true ? 'selected' : ''}`}
                            >
                                <strong className="option-title">Yes</strong>
                                <div className="option-description">
                                    I'm currently enrolled in school/college
                                </div>
                            </button>
                            <button
                                onClick={() => setPreferences(prev => ({ ...prev, is_student: false }))}
                                className={`option-button ${preferences.is_student === false ? 'selected' : ''}`}
                            >
                                <strong className="option-title">No</strong>
                                <div className="option-description">
                                    I'm working or looking for opportunities
                                </div>
                            </button>
                            <button
                                className="primary-button onboarding-next"
                                onClick={() => setStep(4)}
                                disabled={preferences.is_student === null}
                            >
                                Next
                            </button>
                        </div>
                    )}

                    {/* Step 4: Skills */}
                    {step === 4 && (
                        <div className="onboarding-step">
                            <h3 className="step-title">What are you good at?</h3>
                            <p className="step-description">Tell us about your skills, talents, or interests</p>
                            <textarea
                                placeholder="e.g., graphic design, writing, social media, coding, sales..."
                                value={preferences.skills}
                                onChange={(e) => setPreferences(prev => ({ ...prev, skills: e.target.value }))}
                                className="skills-textarea"
                                rows="4"
                            />
                            <button
                                className="primary-button onboarding-next"
                                onClick={() => setStep(5)}
                            >
                                {preferences.skills ? 'Next' : 'Skip'}
                            </button>
                        </div>
                    )}

                    {/* Step 5: Experience Level */}
                    {step === 5 && (
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
                                onClick={() => setStep(6)}
                                disabled={!preferences.skill_level}
                            >
                                Next
                            </button>
                        </div>
                    )}

                    {/* Step 6: Goals */}
                    {step === 6 && (
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