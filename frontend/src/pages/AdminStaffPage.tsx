import { StaffMemberCard } from "@/components/staff/StaffMemberCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageBackdrop } from "@/components/ui/PageBackdrop";
import { useCurrentUser } from "@/hooks/queries/useCurrentUser";
import { useRestaurantStaff } from "@/hooks/queries/useRestaurantStaff";
import { useStaffMutation } from "@/hooks/queries/useStaffMutation";
import { ASSIGNABLE_STAFF_ROLES } from "@/lib/roles";
import type { StaffRole } from "@/types/auth";
import { useState, type SubmitEventHandler } from "react";

export function AdminStaffPage() {
    const { data: currentUser } = useCurrentUser();
    const { data: staff, isPending, isError, error } = useRestaurantStaff();
    const { invite, updateRoles, deactivate } = useStaffMutation();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [inviteRoles, setInviteRoles] = useState<StaffRole[]>(["KITCHEN_STAFF"]);

    const toggleInviteRole = (role: StaffRole) => {
        setInviteRoles((prev) =>
            prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
        );
    };

    const handleInvite: SubmitEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        invite.mutate(
            { firstName, lastName, email, password, roles: inviteRoles },
            {
                onSuccess: () => {
                    setFirstName("");
                    setLastName("");
                    setEmail("");
                    setPassword("");
                    setInviteRoles(["KITCHEN_STAFF"]);
                },
            },
        );
    };

    const isUpdating =
        invite.isPending || updateRoles.isPending || deactivate.isPending;

    return (
        <>
            <PageBackdrop />
            <div className="space-y-8">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400/80">
                        Team
                    </p>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
                        Staff & roles
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm text-zinc-400">
                        Invite kitchen and floor staff. Roles control access to admin tools and the kitchen board.
                    </p>
                </div>

                <GlassCard className="p-6">
                    <h2 className="text-lg font-semibold text-white">Invite staff member</h2>
                    <form onSubmit={handleInvite} className="mt-5 grid gap-4 md:grid-cols-2">
                        <input className="field" placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                        <input className="field" placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                        <input className="field md:col-span-2" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <input className="field md:col-span-2" type="password" placeholder="Temporary password (min 8 chars)" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required />

                        <div className="md:col-span-2">
                            <p className="mb-2 text-sm text-zinc-400">Roles</p>
                            <div className="flex flex-wrap gap-2">
                                {ASSIGNABLE_STAFF_ROLES.map((role) => (
                                    <button
                                        key={role}
                                        type="button"
                                        onClick={() => toggleInviteRole(role)}
                                        className={[
                                            "rounded-full px-3 py-1.5 text-xs font-semibold transition",
                                            inviteRoles.includes(role)
                                                ? "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/30"
                                                : "bg-white/5 text-zinc-400 ring-1 ring-white/10",
                                        ].join(" ")}
                                    >
                                        {role.replace("_", " ")}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <button type="submit" disabled={invite.isPending || inviteRoles.length === 0} className="btn-primary">
                                {invite.isPending ? "Inviting…" : "Invite staff"}
                            </button>
                            {invite.isError && (
                                <p className="mt-3 text-sm text-red-300">{invite.error.message}</p>
                            )}
                        </div>
                    </form>
                </GlassCard>

                <section>
                    <h2 className="text-lg font-semibold text-white">
                        {staff?.length ?? 0} team member{(staff?.length ?? 0) === 1 ? "" : "s"}
                    </h2>

                    {isPending && <p className="mt-4 text-sm text-zinc-400">Loading staff…</p>}
                    {isError && (
                        <p className="mt-4 text-sm text-red-300">
                            {error && typeof error === "object" && "message" in error
                                ? String((error as { message: string }).message)
                                : "Failed to load staff"}
                        </p>
                    )}

                    <div className="mt-4 grid gap-4 lg:grid-cols-2">
                        {(staff ?? []).map((member) => (
                            <StaffMemberCard
                                key={member.id}
                                member={member}
                                isSelf={member.id === currentUser?.id}
                                isUpdating={isUpdating}
                                onSaveRoles={(roles) =>
                                    updateRoles.mutate({ userId: member.id, body: { roles } })
                                }
                                onDeactivate={() => deactivate.mutate(member.id)}
                            />
                        ))}
                    </div>
                </section>
            </div>
        </>
    );
}