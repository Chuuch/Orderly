import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

export function AdminHomePage() {
    const { session } = useAuth();

    return (
        <main className="p-6">
            <h1 className="text-2xl font-semibold">Admin</h1>
            {session && (
                <p className="mt-2">
                    Signed in as {session.firstName} {session.lastName} ({session.email})
                </p>
            )}
            <Link to="/admin/menus" className="mt-4 inline-block underline">
                Manage menus
            </Link>         </main>
    )
}