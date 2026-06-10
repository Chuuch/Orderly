import { useAuth } from "@/hooks/useAuth";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

export function AppShell() {
    const { session, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    const linkClass = ({ isActive }: { isActive: boolean }) =>
        isActive ? 'font-semibold undelint' : 'text-gray-600 hover:underline';

    return (
        <div className="min-h-screen">
            <header className="flex items-center justify-between border-b px-6 py-4">
                <nav className="flex gap-4">
                    <NavLink to="/admin" className={linkClass}>
                        Home
                    </NavLink>
                    <NavLink to="/admin/menus" className={linkClass}>
                        Menus
                    </NavLink>
                </nav>
                <div className="flex items-center gap-4">
                    {session && (
                        <span className="text-sm text-gray-600">
                            {session.firstName} {session.lastName}
                        </span>
                    )}
                    <button type="button" className="text-sm underline" onClick={handleLogout}>
                        Log out
                    </button>
                </div>
            </header>
            <main className="p-6">
                <Outlet />
            </main>
        </div>
    );
}
