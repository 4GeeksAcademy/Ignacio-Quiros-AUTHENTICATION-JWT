import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';

const Private = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        if (!store.isAuthenticated) {
            navigate('/');
        }
    }, [store.isAuthenticated, navigate]);

    const handleLogout = async () => {
        try {
            await actions.logout();
            navigate('/');
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <div>
            <h1>Private Page</h1>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};


export default Private;
