import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import SuccessPage from './SuccessPage.jsx'

const getComponent = () => {
    const path = window.location.pathname;

    if (path === '/success') {
        return <SuccessPage />;
    }

    return <App />;
};

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        {getComponent()}
    </React.StrictMode>,
)