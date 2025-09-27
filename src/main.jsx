import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import SuccessPage from './SuccessPage.jsx'

const getComponent = () => {
    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);

    if (path === '/success') {
        return <SuccessPage />;
    }

    // Pass auth parameter to App component
    return <App showAuth={params.get('auth') === 'true'} />;
};

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        {getComponent()}
    </React.StrictMode>,
)