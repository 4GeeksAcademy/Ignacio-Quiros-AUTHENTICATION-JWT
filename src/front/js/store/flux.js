// flux.js
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
            token: null,
            isAuthenticated: false
        },
        actions: {
            exampleFunction: () => {
                getActions().changeColor(0, "green");
            },

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

            changeColor: (index, color) => {
                const store = getStore();
                const demo = store.demo.map((elm, i) => {
                    if (i === index) elm.background = color;
                    return elm;
                });
                setStore({ demo: demo });
            },

            login: async (email, password) => {
                try {
                    const resp = await fetch(process.env.BACKEND_URL + "/login", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ email, password })
                    });
                    const data = await resp.json();
                    if (resp.ok) {
                        localStorage.setItem('token', data.access_token);
                        setStore({ token: data.access_token, isAuthenticated: true });
                    } else {
                        console.error("Login failed:", data.msg);
                    }
                } catch (error) {
                    console.error("Login error:", error);
                }
            },

            logout: () => {
                localStorage.removeItem('token');
                setStore({ token: null, isAuthenticated: false });
            },

            checkAuth: () => {
                const token = localStorage.getItem('token');
                if (token) {
                    setStore({ token: token, isAuthenticated: true });
                } else {
                    setStore({ token: null, isAuthenticated: false });
                }
            }
        }
    };
};

export default getState;
