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
            }
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
                }
            }
        );
    };

    if (isPending) {
        return <p className="p-6">Loading menus...</p>
    }

    if (isError) {
        const message =
            error && typeof error === "object" && "message" in error
                ? String((error as { message: string }).message)
                : "Failed to load menus";
        return <p className="rounded-2xl bg-red-50 px-4 py-3 text-red-700">{message}</p>;
    }


    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-3xl font-bold text-stone-900">Menus</h1>
                <p className="mt-1 text-sm text-stone-600">Create menus and manage items.</p>
            </div>
            <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-stone-900">Create menu</h2>
                <form onSubmit={handleCreateMenu} className="mt-4 grid gap-3 sm:grid-cols-2">
                    <input
                        className="rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                        placeholder="Menu name"
                        value={newMenuName}
                        onChange={(e) => setNewMenuName(e.target.value)}
                        required
                    />
                    <input
                        className="rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                        placeholder="Description (optional)"
                        value={newMenuDescription}
                        onChange={(e) => setNewMenuDescription(e.target.value)}
                    />
                    <button
                        type="submit"
                        disabled={createMenu.isPending}
                        className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:bg-stone-300 sm:col-span-2"
                    >
                        {createMenu.isPending ? "Creating..." : "Create menu"}
                    </button>
                </form>
            </section>
            {!menus || menus.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-stone-300 bg-white p-8 text-center text-stone-500">
                    No menus yet. Create one above.
                </p>
            ) : (
                menus.map((menu) => (
                    <section
                        key={menu.id}
                        className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
                    >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                                <h2 className="text-xl font-semibold text-stone-900">{menu.name}</h2>
                                {menu.description && (
                                    <p className="mt-1 text-sm text-stone-500">{menu.description}</p>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => setActiveMenuId(activeMenuId === menu.id ? null : menu.id)}
                                className="rounded-xl border border-stone-200 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
                            >
                                {activeMenuId === menu.id ? "Close add item" : "Add item"}
                            </button>
                        </div>
                        {activeMenuId === menu.id && (
                            <form onSubmit={handleAddItem} className="mt-4 grid gap-3 rounded-2xl bg-stone-50 p-4 sm:grid-cols-2">
                                <input
                                    className="rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm"
                                    placeholder="Item name"
                                    value={itemName}
                                    onChange={(e) => setItemName(e.target.value)}
                                    required
                                />
                                <input
                                    className="rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm"
                                    placeholder="Price"
                                    type="number"
                                    min={0.01}
                                    step={0.01}
                                    value={itemPrice}
                                    onChange={(e) => setItemPrice(Number(e.target.value))}
                                    required
                                />
                                <input
                                    className="rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm"
                                    placeholder="Prep time (minutes)"
                                    type="number"
                                    min={1}
                                    value={itemPreparationTime}
                                    onChange={(e) => setItemPreparationTime(Number(e.target.value))}
                                    required
                                />
                                <input
                                    className="rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm"
                                    placeholder="Description (optional)"
                                    value={itemDescription}
                                    onChange={(e) => setItemDescription(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    disabled={addMenuItem.isPending}
                                    className="rounded-xl bg-stone-900 px-4 py-3 text-sm font-semibold text-white hover:bg-stone-800 disabled:bg-stone-300 sm:col-span-2"
                                >
                                    {addMenuItem.isPending ? "Adding..." : "Add item"}
                                </button>
                            </form>
                        )}
                        <ul className="mt-6 space-y-3">
                            {(menu.items ?? []).map((item) => {
                                const unavailable = item.isAvailable === false;
                                return (
                                    <li
                                        key={item.id}
                                        className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-stone-200 p-4"
                                    >
                                        <div>
                                            <p className="font-medium text-stone-900">{item.name}</p>
                                            {item.description && (
                                                <p className="text-sm text-stone-500">{item.description}</p>
                                            )}
                                            <p className="mt-1 text-sm font-semibold text-emerald-700">
                                                {item.price.toFixed(2)}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            disabled={toggleAvailability.isPending}
                                            onClick={() => toggleAvailability.mutate(item.id)}
                                            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                                                unavailable
                                                    ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                                                    : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                                            }`}
                                        >
                                            {unavailable ? "Mark available" : "Mark unavailable"}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </section>
                ))
            )}
        </div>
    );
}