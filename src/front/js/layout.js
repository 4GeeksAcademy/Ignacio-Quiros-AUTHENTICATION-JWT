import React, { useEffect, useContext } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";
import { Home } from "./pages/home";
import { Demo } from "./pages/demo";
import { Single } from "./pages/single";
import Private from "./pages/Private"; // Asegúrate de que esta ruta sea correcta
import injectContext, { Context } from "./store/appContext";
import  Navbar  from "./component/Navbar"; // Importar como componente con nombre
import  Footer  from "./component/Footer"; // Importar como componente con nombre

const Layout = () => {
    const { store, actions } = useContext(Context);
    const basename = process.env.BASENAME || "";

    useEffect(() => {
        actions.checkAuth(); // Verifica la autenticación al cargar
    }, [actions]);

    if (!process.env.BACKEND_URL || process.env.BACKEND_URL === "") return <BackendURL />;

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>
                        <Route path="/" element={store.isAuthenticated ? <Navigate to="/private" /> : <Home />} />
                        <Route path="/demo" element={<Demo />} />
                        <Route path="/single/:theid" element={<Single />} />
                        <Route path="/private" element={store.isAuthenticated ? <Private /> : <Navigate to="/" />} />
                        <Route path="*" element={<h1>Not found!</h1>} />
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
