const ROLE_STYLES: Record<string, string> = {
    RESTAURANT_ADMIN: "bg-violet-500/15 text-violet-300 ring-1 ring-violet-400/20",
    KITCHEN_STAFF: "bg-amber-500/15 text-amber-300 ring-1 ring-amber-400/20",
    WAITER: "bg-sky-500/15 text-sky-300 ring-1 ring-sky-400/20",
    CUSTOMER: "bg-zinc-500/15 text-zinc-300 ring-1 ring-zinc-400/20",
};

export function RoleBadge({ role }: { role: string }) {
    return (
        <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${ROLE_STYLES[role] ?? ROLE_STYLES.CUSTOMER}`}
        >
            {role.replace("_", " ")}
        </span>
    );
}