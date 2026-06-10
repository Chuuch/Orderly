import { useRestaurantMenus } from "@/hooks/queries/useRestrautanMenus";

export function AdminMenuPage() {
    const { data: menus, isPending, isError, error } = useRestaurantMenus();

    if (isPending) {
        return <p className="p-6">Loading menus...</p>;
    }

    if (isError) {
        const message =
            error && typeof error === "object" && "message" in error
                ? String((error as { message: string }).message)
                : "Failed to load menus";
        return <p className="p-6 text-red-600">{message}</p>;
    }

    if (!menus || menus.length === 0) {
        return <p className="p-6">No menus yet.</p>;
    }

    return (
        <div>
            <h1 className="mb-6 text-2xl font-semibold">Menus</h1>
            {menus.map((menu) => (
                <section key={menu.id} className="mb-8">
                    <h2 className="mb-1 text-xl font-medium">{menu.name}</h2>
                    {menu.description && (
                        <p className="mb-4 text-sm text-gray-600">{menu.description}</p>
                    )}
                    <ul className="space-y-3">
                        {(menu.items ?? []).map((item) => (
                            <li
                                key={item.id}
                                className="flex items-start justify-between rounded border p-3"
                            >
                                <div>
                                    <p className="font-medium">{item.name}</p>
                                    {item.description && (
                                        <p className="text-sm text-gray-600">{item.description}</p>
                                    )}
                                    {item.isAvailable === false && (
                                        <p className="text-sm text-amber-600">Unavailable</p>
                                    )}
                                </div>
                                <p className="font-medium">{item.price.toFixed(2)}</p>
                            </li>
                        ))}
                    </ul>
                </section>
            ))}
        </div>
    );
}