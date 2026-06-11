import { useAuth } from "@/hooks/useAuth";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

export function AppShell() {
    const { session, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    const linkClass = ({ isActive }: { isActive: boolean }) =>
        isActive
            ? "font-semibold text-stone-900"
            : "text-stone-500 transition hover:text-stone-900";

    return (
        <div className="min-h-screen bg-stone-50">
            <header className="sticky top-0 z-30 border-b border-stone-200/80 bg-white/90 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-8">
                        <span className="text-sm font-bold tracking-tight text-emerald-700">
                            Orderly
                        </span>
                        <nav className="flex gap-5 text-sm">
                            <NavLink to="/admin" className={linkClass}>
                                Home
                            </NavLink>
                            <NavLink to="/admin/menus" className={linkClass}>
                                Menus
                            </NavLink>
                            <NavLink to="/admin/tables" className={linkClass}>
                                Tables
                            </NavLink>
                            <NavLink to="/kitchen" className={linkClass}>
                                Kitchen
                            </NavLink>
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        {session && (
                            <span className="text-sm text-stone-600">
                                {session.firstName} {session.lastName}
                            </span>
                        )}
                        <button
                            type="button"
                            className="text-sm font-medium text-stone-600 transition hover:text-stone-900"
                            onClick={handleLogout}
                        >
                            Log out
                        </button>
                    </div>
                </div>
            </header>
            <main className="mx-auto max-w-7xl p-6">
                <Outlet />
            </main>
        </div>
    );
}