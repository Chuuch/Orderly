import { RoleBadge } from "@/components/ui/RoleBadge";
import { GlassCard } from "@/components/ui/GlassCard";
import { ALL_STAFF_ROLES } from "@/lib/roles";
import type { StaffRole } from "@/types/auth";
import type { UserResponse } from "@/types/user";
import { useState } from "react";

type StaffMemberCardProps = {
    member: UserResponse;
    isSelf: boolean;
    isUpdating: boolean;
    onSaveRoles: (roles: StaffRole[]) => void;
    onDeactivate: () => void;
};

export function StaffMemberCard({
    member,
    isSelf,
    isUpdating,
    onSaveRoles,
    onDeactivate,
}: StaffMemberCardProps) {
    const [selectedRoles, setSelectedRoles] = useState<StaffRole[]>(
        member.roles.filter((r): r is StaffRole =>
            ALL_STAFF_ROLES.includes(r as StaffRole),
        ),
    );

    const toggleRole = (role: StaffRole) => {
        setSelectedRoles((prev) =>
            prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
        );
    };

  return (
        <GlassCard className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h3 className="text-lg font-semibold text-white">
                        {member.firstName} {member.lastName}
                        {isSelf && (
                            <span className="ml-2 text-xs font-medium text-emerald-300">(you)</span>
                        )}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-400">{member.email}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    {member.roles.map((role) => (
                        <RoleBadge key={role} role={role} />
                    ))}
                </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
                {ALL_STAFF_ROLES.map((role) => (
                    <button
                        key={role}
                        type="button"
                        onClick={() => toggleRole(role)}
                        className={[
                            "rounded-full px-3 py-1.5 text-xs font-semibold transition",
                            selectedRoles.includes(role)
                                ? "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/30"
                                : "bg-white/5 text-zinc-400 ring-1 ring-white/10 hover:bg-white/10",
                        ].join(" ")}
                    >
                        {role.replace("_", " ")}
                    </button>
                ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
                <button
                    type="button"
                    disabled={isUpdating || selectedRoles.length === 0}
                    onClick={() => onSaveRoles(selectedRoles)}
                    className="btn-primary"
                >
                    Save roles
                </button>
                {!isSelf && (
                    <button
                        type="button"
                        disabled={isUpdating}
                        onClick={onDeactivate}
                        className="btn-ghost text-red-300 hover:text-red-200"
                    >
                        Deactivate
                    </button>
                )}
            </div>
        </GlassCard>
    );
}