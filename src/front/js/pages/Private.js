import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext'; // Importar Context

const Private = () => {
    const { store, actions } = useContext(Context); // Utilizar Context para obtener el store y las acciones
    const navigate = useNavigate();

    useEffect(() => {
        if (!store.isAuthenticated) {
            navigate('/');
        }
    }, [store.isAuthenticated, navigate]);

    return (
        <div>
            <h1>Private Page</h1>
            {/* Contenido de la página privada */}
            <button onClick={() => actions.logout()}>Logout</button>
        </div>
    );
};

export default Private;
