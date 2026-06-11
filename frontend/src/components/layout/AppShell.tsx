import { PageBackdrop } from "@/components/ui/PageBackdrop";
import { useAuth } from "@/hooks/useAuth";
import { useCurrentUser } from "@/hooks/queries/useCurrentUser";
import { canAccessAdmin } from "@/lib/roles";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

export function AppShell() {
    const { session, logout } = useAuth();
    const { data: currentUser } = useCurrentUser();
    const navigate = useNavigate();
    const isAdmin = canAccessAdmin(currentUser?.roles ?? session?.roles);

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    const linkClass = ({ isActive }: { isActive: boolean }) =>
        [
            "rounded-lg px-3 py-2 text-sm font-medium transition",
            isActive
                ? "bg-white/10 text-white"
                : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100",
        ].join(" ");

    return (
        <>
            <PageBackdrop />
            <div className="relative min-h-screen">
                <header className="sticky top-0 z-30 border-b border-white/10 bg-[#070b10]/70 backdrop-blur-xl">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-8">
                            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-sm font-extrabold tracking-tight text-transparent">
                                Orderly
                            </span>
                            <nav className="flex flex-wrap gap-1">
                                {isAdmin && (
                                    <>
                                        <NavLink to="/admin" end className={linkClass}>Home</NavLink>
                                        <NavLink to="/admin/menus" className={linkClass}>Menus</NavLink>
                                        <NavLink to="/admin/tables" className={linkClass}>Tables</NavLink>
                                        <NavLink to="/admin/staff" className={linkClass}>Staff</NavLink>
                                    </>
                                )}
                                <NavLink to="/kitchen" className={linkClass}>Kitchen</NavLink>
                            </nav>
                        </div>
                        <div className="flex items-center gap-4">
                            {session && (
                                <span className="hidden text-sm text-zinc-400 sm:inline">
                                    {session.firstName} {session.lastName}
                                </span>
                            )}
                            <button type="button" onClick={handleLogout} className="btn-ghost">
                                Log out
                            </button>
                        </div>
                    </div>
                </header>
                <main className="mx-auto max-w-7xl p-6">
                    <Outlet />
                </main>
            </div>
        </>
    );
}