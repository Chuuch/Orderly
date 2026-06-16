import { useCurrentUser } from "@/hooks/queries/useCurrentUser";
import { canAccessAdmin } from "@/lib/roles";
import { Navigate, Outlet } from "react-router-dom";

export function AdminOnlyRoute() {
    const { data: user, isPending } = useCurrentUser();

    if (isPending) {
        return (
            <div className="flex min-h-[40vh] items-center justify-center text-sm text-zinc-400">
                Loading…
            </div>
        );
    }

    if (!canAccessAdmin(user?.roles)) {
        return <Navigate to="/kitchen" replace />;
    }

    return <Outlet />;
}