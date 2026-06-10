import { authStorage } from "@/lib/auth-storage"
import type { AuthResponse } from "@/types/auth"
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react"

type AuthContextValue = {
    session: AuthResponse | null
    isAuthenticated: boolean
    setSession: (session: AuthResponse) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

type AuthProviderProps = {
    children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [session, setSessionState] = useState<AuthResponse | null>(() =>
    authStorage.getSession()
    );

    const setSession = useCallback((next: AuthResponse) => {
        authStorage.setSession(next);
        setSessionState(next);
    }, []);

    const logout = useCallback(() => {
        authStorage.clear();
        setSessionState(null);
    }, []);

    const value = useMemo<AuthContextValue>(
        () => ({
            session,
            isAuthenticated: session !== null,
            setSession,
            logout,
        }),
        [session, setSession, logout],
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}