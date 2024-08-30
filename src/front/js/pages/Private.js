import React, { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';
import "../../styles/private.css";

const Private = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

  

    useEffect(() => {
        const checkAuthentication = async () => {
            await actions.checkAuth();
        };
        
        checkAuthentication();
    }, []); 


    const handleLogout = async () => {
        try {
            await actions.logout();
            navigate('/'); // Redirect after logout
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    //Only if you try to put /private manually instead of the log in step
    useEffect(() => {
        if (store.isAuthenticated === false) {
            navigate('/'); 
        }
    }, [store.isAuthenticated, navigate]); 


    return (
        <div className="private-container">
            <h1>Welcome to Your Private Page</h1>
            {store.user ? (
                <div className="user-info">
                    <h2>User Information</h2>
                    <p><strong>Email:</strong> {store.user.email}</p>
                    <p><strong>Status:</strong> {store.user.is_active ? 'Active' : 'Inactive'}</p>
                </div>
            ) : (
                <p>Loading user information...</p>
            )}
            <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
    );
};

export default Private;
