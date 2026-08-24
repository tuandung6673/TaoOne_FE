import { useCallback, useEffect, useState } from "react";
import { AuthResponseData } from "../constants/interface";

const AUTH_EVENT = "authchange";

export interface AuthState {
    username: string | null;
    role: string | null;
    token: string | null;
}

const readAuth = (): AuthState => ({
    username: localStorage.getItem("username"),
    role: localStorage.getItem("role"),
    token: localStorage.getItem("token"),
});

export const setAuth = (data: AuthResponseData) => {
    localStorage.setItem("username", data.username);
    localStorage.setItem("role", data.role);
    localStorage.setItem("token", data.token);
    window.dispatchEvent(new Event(AUTH_EVENT));
};

export const clearAuth = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    window.dispatchEvent(new Event(AUTH_EVENT));
};

export const useAuth = () => {
    const [auth, setAuthState] = useState<AuthState>(readAuth);

    useEffect(() => {
        const handleChange = () => setAuthState(readAuth());
        window.addEventListener(AUTH_EVENT, handleChange);
        window.addEventListener("storage", handleChange);
        return () => {
            window.removeEventListener(AUTH_EVENT, handleChange);
            window.removeEventListener("storage", handleChange);
        };
    }, []);

    const logout = useCallback(() => {
        clearAuth();
    }, []);

    return { ...auth, isLoggedIn: !!auth.token, logout };
};
