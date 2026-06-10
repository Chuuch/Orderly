import type { AuthResponse } from "@/types/auth";

const TOKEN_KEY = 'orderly_access_token';
const SESSION_KEY = 'orderly_session';

export const authStorage = {
    getToken: () => sessionStorage.getItem(TOKEN_KEY),
    setToken: (token: string) => sessionStorage.setItem(TOKEN_KEY, token),
    getSession: (): AuthResponse | null => {
        const raw = sessionStorage.getItem(SESSION_KEY)
        return raw ? (JSON.parse(raw) as AuthResponse) : null;
    },
    setSession: (session: AuthResponse) => {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
        sessionStorage.setItem(TOKEN_KEY, session.accessToken);
    },
    clear: () => {
         sessionStorage.removeItem(TOKEN_KEY);
         sessionStorage.removeItem(SESSION_KEY);
    }
}