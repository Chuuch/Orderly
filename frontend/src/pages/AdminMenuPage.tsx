import { GlassCard } from "@/components/ui/GlassCard";
import { useMenuMutations } from "@/hooks/queries/useMenuMutations";
import { useRestaurantMenus } from "@/hooks/queries/useRestaurantMenus";
import { useState, type SubmitEventHandler } from "react";

export function AdminMenuPage() {
    const { data: menus, isPending, isError, error } = useRestaurantMenus();
    const { createMenu, addMenuItem, toggleAvailability } = useMenuMutations();

    const [newMenuName, setNewMenuName] = useState<string>("");
    const [newMenuDescription, setNewMenuDescription] = useState<string>("");
    const [activeMenuId, setActiveMenuId] = useState<string | undefined>(undefined);

    const [itemName, setItemName] = useState<string>("");
    const [itemPrice, setItemPrice] = useState<number>(0);
    const [itemPreparationTime, setItemPreparationTime] = useState<number>(15);
    const [itemDescription, setItemDescription] = useState<string>("");

    const handleCreateMenu: SubmitEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        createMenu.mutate(
            { menuName: newMenuName.trim(), description: newMenuDescription.trim() || undefined },
            {
                onSuccess: () => {
                    setNewMenuName("");
                    setNewMenuDescription("");
                },
            },
        );
    };

    const handleAddItem: SubmitEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        if (!activeMenuId) return;

        addMenuItem.mutate(
            {
                menuId: activeMenuId,
                body: {
                    name: itemName.trim(),
                    description: itemDescription.trim() || undefined,
                    price: Number(itemPrice),
                    preparationTimeMinutes: Number(itemPreparationTime),
                },
            },
            {
                onSuccess: () => {
                    setItemName("");
                    setItemPrice(0);
                    setItemPreparationTime(15);
                    setItemDescription("");
                },
            },
        );
    };

    if (isPending) {
        return (
            <div className="flex min-h-[40vh] items-center justify-center">
                <p className="text-sm text-zinc-400">Loading menus…</p>
            </div>
        );
    }

    if (isError) {
        const message =
            error && typeof error === "object" && "message" in error
                ? String((error as { message: string }).message)
                : "Failed to load menus";
        return (
            <p className="rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-300">{message}</p>
        );
    }

    return (
        <div className="space-y-10">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400/80">
                    Catalog
                </p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">Menus</h1>
                <p className="mt-2 text-sm text-zinc-400">Create menus and manage items.</p>
            </div>

            <GlassCard className="p-6">
                <h2 className="text-lg font-semibold text-white">Create menu</h2>
                <form onSubmit={handleCreateMenu} className="mt-4 grid gap-3 sm:grid-cols-2">
                    <input
                        className="field"
                        placeholder="Menu name"
                        value={newMenuName}
                        onChange={(e) => setNewMenuName(e.target.value)}
                        required
                    />
                    <input
                        className="field"
                        placeholder="Description (optional)"
                        value={newMenuDescription}
                        onChange={(e) => setNewMenuDescription(e.target.value)}
                    />
                    <button
                        type="submit"
                        disabled={createMenu.isPending}
                        className="btn-primary sm:col-span-2"
                    >
                        {createMenu.isPending ? "Creating…" : "Create menu"}
                    </button>
                </form>
            </GlassCard>

            {!menus || menus.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-white/10 bg-white/5 px-4 py-8 text-center text-sm text-zinc-400">
                    No menus yet. Create one above.
                </p>
            ) : (
                menus.map((menu) => (
                    <GlassCard key={menu.id} className="p-6">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                                <h2 className="text-xl font-semibold text-white">{menu.name}</h2>
                                {menu.description && (
                                    <p className="mt-1 text-sm text-zinc-400">{menu.description}</p>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() =>
                                    setActiveMenuId(activeMenuId === menu.id ? undefined : menu.id)
                                }
                                className="btn-ghost"
                            >
                                {activeMenuId === menu.id ? "Close add item" : "Add item"}
                            </button>
                        </div>

                        {activeMenuId === menu.id && (
                            <form
                                onSubmit={handleAddItem}
                                className="mt-4 grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 sm:grid-cols-2"
                            >
                                <input
                                    className="field"
                                    placeholder="Item name"
                                    value={itemName}
                                    onChange={(e) => setItemName(e.target.value)}
                                    required
                                />
                                <input
                                    className="field"
                                    placeholder="Price"
                                    type="number"
                                    min={0.01}
                                    step={0.01}
                                    value={itemPrice}
                                    onChange={(e) => setItemPrice(Number(e.target.value))}
                                    required
                                />
                                <input
                                    className="field"
                                    placeholder="Prep time (minutes)"
                                    type="number"
                                    min={1}
                                    value={itemPreparationTime}
                                    onChange={(e) => setItemPreparationTime(Number(e.target.value))}
                                    required
                                />
                                <input
                                    className="field"
                                    placeholder="Description (optional)"
                                    value={itemDescription}
                                    onChange={(e) => setItemDescription(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    disabled={addMenuItem.isPending}
                                    className="btn-primary sm:col-span-2"
                                >
                                    {addMenuItem.isPending ? "Adding…" : "Add item"}
                                </button>
                            </form>
                        )}

                        <ul className="mt-6 space-y-3">
                            {(menu.items ?? []).map((item) => {
                                const unavailable = item.isAvailable === false;
                                return (
                                    <li
                                        key={item.id}
                                        className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4"
                                    >
                                        <div>
                                            <p className="font-medium text-white">{item.name}</p>
                                            {item.description && (
                                                <p className="text-sm text-zinc-400">{item.description}</p>
                                            )}
                                            <p className="mt-1 text-sm font-semibold text-emerald-400">
                                                {item.price.toFixed(2)}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            disabled={toggleAvailability.isPending}
                                            onClick={() => toggleAvailability.mutate(item.id)}
                                            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                                                unavailable
                                                    ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/20 hover:bg-emerald-500/25"
                                                    : "bg-amber-500/15 text-amber-300 ring-1 ring-amber-400/20 hover:bg-amber-500/25"
                                            }`}
                                        >
                                            {unavailable ? "Mark available" : "Mark unavailable"}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </GlassCard>
                ))
            )}
        </div>
    );
}
