import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Context } from '../store/appContext';
import "../../styles/navbar.css";

const Navbar = () => {
    const { store, actions } = useContext(Context);
    const [isAuthenticated, setIsAuthenticated] = useState(store.isAuthenticated);

  // Use useEffect to update local state when store.isAuthenticated changes
  useEffect(() => {
    //console.log("Navbar useEffect:", store.isAuthenticated); // Debugging
    setIsAuthenticated(store.isAuthenticated);
}, [store.isAuthenticated]);

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">MyApp</Link>
                <ul className="navbar-menu">
                    <li className="navbar-item">
                        <Link to="/" className="navbar-link">Home</Link>
                    </li>
                    {isAuthenticated ? (
                        <>
                            <li className="navbar-item">
                                <Link to="/private" className="navbar-link">Private</Link>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="navbar-item">
                                <Link to="/login" className="navbar-link">Login</Link>
                            </li>
                            <li className="navbar-item">
                                <Link to="/register" className="navbar-link">Register</Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;