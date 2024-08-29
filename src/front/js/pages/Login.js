import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext'; 

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { actions } = useContext(Context); 
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        actions.login(email, password).then(() => {
            navigate('/private');
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Email:
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>
            <label>
                Password:
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </label>
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;
