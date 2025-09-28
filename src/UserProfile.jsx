import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import './App.css';

function UserProfile({ user, onClose }) {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState(user.email);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
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

  const handleManageBilling = () => {
    // This would redirect to Stripe Customer Portal
    window.location.href = 'https://billing.stripe.com/p/login/test_YOUR_LINK';
    // You'll get this link from Stripe Dashboard → Customer Portal
  };

  return (
    <div style={{
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
    }}>
      <div style={{
        background: 'var(--secondary-black)',
        border: '1px solid var(--border-gray)',
        padding: '40px',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '80vh',
        overflow: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
          <h2>Profile Settings</h2>
          <button 
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-gray)',
              fontSize: '24px',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-gray)' }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            disabled
            style={{
              width: '100%',
              padding: '15px',
              background: 'var(--primary-black)',
              border: '1px solid var(--border-gray)',
              color: 'var(--text-gray)',
              fontSize: '16px',
              opacity: 0.7
            }}
          />
          <small style={{ color: 'var(--text-gray)', fontSize: '12px' }}>
            Email cannot be changed
          </small>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-gray)' }}>
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
              background: 'var(--primary-black)',
              border: '1px solid var(--border-gray)',
              color: 'white',
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
          {loading ? 'Saving...' : 'Save Changes'}
        </button>

        <div style={{ borderTop: '1px solid var(--border-gray)', paddingTop: '20px', marginTop: '30px' }}>
          <h3 style={{ marginBottom: '20px' }}>Subscription</h3>
          <button
            onClick={handleManageBilling}
            className="secondary-button"
            style={{ width: '100%' }}
          >
            Manage Billing & Payment Method
          </button>
          <small style={{ display: 'block', marginTop: '10px', color: 'var(--text-gray)', textAlign: 'center' }}>
            Update card, view invoices, or cancel subscription
          </small>
        </div>

        {message && (
          <p style={{
            marginTop: '20px',
            color: message.includes('updated') ? 'var(--accent-gold)' : 'var(--accent-red)',
            textAlign: 'center'
          }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default UserProfile;