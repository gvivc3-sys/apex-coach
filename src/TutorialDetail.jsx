import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import ReactMarkdown from 'react-markdown';
import './TutorialDetail.css';

function TutorialDetail({ tutorialId, onClose }) {
    const [tutorial, setTutorial] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTutorial();
    }, [tutorialId]);

    const fetchTutorial = async () => {
        const { data } = await supabase
            .from('tutorials')
            .select('*')
            .eq('id', tutorialId)
            .single();

        setTutorial(data);
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="tutorial-overlay">
                <div className="tutorial-modal">
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="tutorial-overlay" onClick={onClose}>
            <div className="tutorial-modal" onClick={(e) => e.stopPropagation()}>
                <button className="tutorial-close" onClick={onClose}>×</button>

                <div className="tutorial-header">
                    <h1>{tutorial.title}</h1>
                    <div className="tutorial-meta">
                        <span className="meta-badge">{tutorial.level}</span>
                        <span className="meta-time">{tutorial.time_minutes} min read</span>
                    </div>
                </div>

                {tutorial.video_url && (
                    <div style={{
                        position: 'relative',
                        paddingBottom: '56.25%', // 16:9 aspect ratio
                        height: 0,
                        marginBottom: 'var(--space-xl)',
                        borderRadius: 'var(--radius-md)',
                        overflow: 'hidden'
                    }}>
                        <iframe
                            src={tutorial.video_url}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                border: 'none'
                            }}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                )}

                <div className="tutorial-content">
                    <ReactMarkdown>{tutorial.content}</ReactMarkdown>
                </div>

                {tutorial.key_points && tutorial.key_points.length > 0 && (
                    <div className="tutorial-keypoints">
                        <h3>Key Takeaways</h3>
                        <ul>
                            {tutorial.key_points.map((point, i) => (
                                <li key={i}>{point}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TutorialDetail;