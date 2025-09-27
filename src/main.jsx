import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Success from './Success.jsx'

// Simple routing based on URL
const getComponent = () => {
    const path = window.location.pathname;

    if (path === '/success') {
        return <Success />;
    }

    return <App />;
};

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        {getComponent()}
    </React.StrictMode>,
)