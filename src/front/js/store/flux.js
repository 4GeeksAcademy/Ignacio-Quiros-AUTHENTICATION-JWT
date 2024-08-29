const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            message: null,
            demo: [
                {
                    title: "FIRST",
                    background: "white",
                    initial: "white"
                },
                {
                    title: "SECOND",
                    background: "white",
                    initial: "white"
                }
            ],
            isAuthenticated: false,  // Añadir estado de autenticación
            user: null,  // Información del usuario autenticado
        },
        actions: {
            // Función para iniciar sesión
            login: async (email, password) => {
				try {
					const response = await fetch(process.env.BACKEND_URL + '/login', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({ email, password }),
					});
					const data = await response.json();
					if (response.ok) {
						localStorage.setItem('token', data.access_token); // Almacena el token
						setStore({ isAuthenticated: true });
						return data;
					} else {
						throw new Error(data.msg || 'Login failed');
					}
				} catch (error) {
					console.error("Login error", error);
					throw error;
				}
			},
            // Función para cerrar sesión
			logout: () => {
				// Elimina el token del almacenamiento local o del estado global
				localStorage.removeItem('token'); // O el nombre que uses
				setStore({ isAuthenticated: false });
			},
            // Función para verificar el estado de autenticación
            checkAuth: async () => {
                const token = localStorage.getItem("token");
                if (token) {
                    try {
                        const response = await fetch(process.env.BACKEND_URL + "/private", {
                            headers: {
                                "Authorization": `Bearer ${token}`
                            }
                        });
                        if (response.ok) {
                            const data = await response.json();
                            setStore({ isAuthenticated: true, user: data.user_data });
                        } else {
                            setStore({ isAuthenticated: false });
                        }
                    } catch (error) {
                        console.error("Auth check error", error);
                        setStore({ isAuthenticated: false });
                    }
                } else {
                    setStore({ isAuthenticated: false });
                }
            },
            // Ejemplo de obtener mensaje
            getMessage: async () => {
                try {
                    const resp = await fetch(process.env.BACKEND_URL + "/api/hello");
                    const data = await resp.json();
                    setStore({ message: data.message });
                    return data;
                } catch (error) {
                    console.log("Error loading message from backend", error);
                }
            },
            // Ejemplo de cambiar color
            changeColor: (index, color) => {
                const store = getStore();
                const demo = store.demo.map((elm, i) => {
                    if (i === index) elm.background = color;
                    return elm;
                });
                setStore({ demo: demo });
            },
			register: async (email, password) => {
				try {
					const response = await fetch(process.env.BACKEND_URL + '/register', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({ email, password }),
					});
					const data = await response.json();
					if (response.ok) {
						return data;
					} else {
						throw new Error(data.msg || 'Registration failed');
					}
				} catch (error) {
					console.error("Registration error", error);
					throw error;
				}
			},
        }
    };
};

export default getState;
