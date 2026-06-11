import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

export function AdminHomePage() {
    const { session } = useAuth();

    return (
        <div>
            <h1 className="text-3xl font-bold text-stone-900">Admin</h1>
            {session && (
                <p className="mt-2 text-stone-600">
                    Signed in as {session.firstName} {session.lastName} ({session.email})
                </p>
            )}

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <Link
                    to="/admin/menus"
                    className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                    <h2 className="font-semibold text-stone-900">Menus</h2>
                    <p className="mt-1 text-sm text-stone-500">View restaurant menus and items</p>
                </Link>
                <Link
                    to="/kitchen"
                    className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                    <h2 className="font-semibold text-stone-900">Kitchen board</h2>
                    <p className="mt-1 text-sm text-stone-500">
                        Live orders and status updates
                    </p>
                </Link>
            </div>
        </div>
    );
}