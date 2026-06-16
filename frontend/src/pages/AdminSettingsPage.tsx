import { GlassCard } from "@/components/ui/GlassCard";
import { restaurantApi } from "@/api/restaurant.api";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { SubmitEventHandler } from "react";

export function AdminSettingsPage() {
    const { session } = useAuth();
    const restaurantId = session?.restaurantId;
    const queryClient = useQueryClient();

    const { data, isPending, isError } = useQuery({
        queryKey: ["restaurant", restaurantId],
        queryFn: () => restaurantApi.getRestaurant(restaurantId!),
        enabled: Boolean(restaurantId),
    });

    const update = useMutation({
        mutationFn: (body: Parameters<typeof restaurantApi.updateRestaurant>[1]) =>
            restaurantApi.updateRestaurant(restaurantId!, body),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["restaurant", restaurantId] }),
    });

    const onSubmit: SubmitEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        update.mutate({
            name: String(form.get("name")),
            address: String(form.get("address") || "") || undefined,
            phoneNumber: String(form.get("phoneNumber") || "") || undefined,
            isActive: form.get("isActive") === "on",
        });
    };

    if (!restaurantId) return null;
    if (isPending) return <p className="text-zinc-400">Loading settings…</p>;
    if (isError || !data) return <p className="text-red-300">Failed to load settings.</p>;

    return (
        <div className="space-y-8">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400/80">
                    Restaurant
                </p>
                <h1 className="mt-2 text-3xl font-bold text-white">Settings</h1>
            </div>

            <GlassCard className="p-6">
                <form onSubmit={onSubmit} className="space-y-4">
                    <input className="field" name="name" defaultValue={data.name} required />
                    <input className="field" name="address" defaultValue={data.address ?? ""} />
                    <input className="field" name="phoneNumber" defaultValue={data.phoneNumber ?? ""} />
                    <p className="text-sm text-zinc-500">Subdomain: {data.subdomain}</p>

                    <label className="flex items-center gap-2 text-sm text-zinc-300">
                        <input type="checkbox" name="isActive" defaultChecked={data.active} />
                        Restaurant active
                    </label>

                    <button type="submit" disabled={update.isPending} className="btn-primary">
                        {update.isPending ? "Saving…" : "Save changes"}
                    </button>
                </form>
            </GlassCard>
        </div>
    );
}