import { GlassCard } from "@/components/ui/GlassCard";
import { PageBackdrop } from "@/components/ui/PageBackdrop";
import { useAuth } from "@/hooks/useAuth";
import { useCurrentUser } from "@/hooks/queries/useCurrentUser";
import { Link } from "react-router-dom";

const cards = [
    { to: "/admin/menus", title: "Menus", desc: "Create menus and manage items" },
    { to: "/admin/tables", title: "Tables & QR", desc: "Table setup and customer QR links" },
    { to: "/admin/staff", title: "Staff", desc: "Invite team members and assign roles" },
    { to: "/kitchen", title: "Kitchen board", desc: "Live orders and status updates" },
];

export function AdminHomePage() {
    const { session } = useAuth();
    const { data: currentUser } = useCurrentUser();
    const roles = currentUser?.roles?.join(", ");

    return (
        <>
            <PageBackdrop />
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400/80">Dashboard</p>
                <h1 className="mt-2 text-3xl font-bold text-white">Admin</h1>
                {session && (
                    <p className="mt-2 text-zinc-400">
                        Signed in as {session.firstName} {session.lastName}
                        {roles && <span className="mt-1 block text-sm text-zinc-500">Roles: {roles}</span>}
                    </p>
                )}
                <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {cards.map((card) => (
                        <Link key={card.to} to={card.to}>
                            <GlassCard className="group h-full p-6 transition hover:bg-white/[0.08]">
                                <h2 className="font-semibold text-white group-hover:text-emerald-300">{card.title}</h2>
                                <p className="mt-2 text-sm text-zinc-400">{card.desc}</p>
                            </GlassCard>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}