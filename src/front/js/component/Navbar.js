import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Context } from '../store/appContext'; 

const Navbar = () => {
    const { store, actions } = useContext(Context); 

    return (
        <nav>
            <Link to="/">Home</Link>
            {store.isAuthenticated ? (
                <>
                    <Link to="/private">Private</Link>
                    <button onClick={() => actions.logout()}>Logout</button>
                </>
            ) : (
                <>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                </>
            )}
        </nav>
    );
};

export default Navbar;
