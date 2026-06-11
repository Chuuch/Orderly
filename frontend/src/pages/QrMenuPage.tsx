import { CartBar } from "@/components/cart/CartBar";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { MenuItemCard } from "@/components/menu/MenuItemCard";
import { OrderSuccessPanel } from "@/components/order/OrderSuccessPanel";
import { useCart } from "@/hooks/useCart";
import { usePlaceOrder } from "@/hooks/queries/usePlaceOrder";
import { useQrContext } from "@/hooks/queries/useQrContext";
import type { OrderResponse } from "@/types/order";
import { useState } from "react";
import { useParams } from "react-router-dom";

export function QrMenuPage() {
    const { qrToken } = useParams<{ qrToken: string }>();
    const { data, isPending, isError, error } = useQrContext(qrToken);
    const cart = useCart(qrToken);
    const placeOrder = usePlaceOrder();

    const [cartOpen, setCartOpen] = useState(false);
    const [placedOrder, setPlacedOrder] = useState<OrderResponse | null>(null);

    if (isPending) {
        return (
            <main className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
                    <p className="mt-4 text-sm text-stone-500">Loading menu...</p>
                </div>
            </main>
        );
    }

    if (isError) {
        const message =
            error && typeof error === "object" && "message" in error
                ? String((error as { message: string }).message)
                : "Failed to load menu";
        return (
            <main className="flex min-h-screen items-center justify-center px-6">
                <p className="rounded-2xl bg-red-50 px-4 py-3 text-red-700">{message}</p>
            </main>
        );
    }

    if (!data || !qrToken) {
        return (
            <main className="flex min-h-screen items-center justify-center px-6">
                <p className="text-stone-500">No menu data found.</p>
            </main>
        );
    }

    if (placedOrder) {
        return (
            <OrderSuccessPanel
                order={placedOrder}
                restaurantName={data.restaurant.name}
                tableNumber={data.table.tableNumber}
                onOrderMore={() => setPlacedOrder(null)}
            />
        );
    }

    const { restaurant, table, menus } = data;

    const handlePlaceOrder = (orderNotes: string) => {
        placeOrder.mutate(
            {
                qrToken,
                body: {
                    items: cart.lines.map((line) => ({
                        menuItemId: line.menuItemId,
                        quantity: line.quantity,
                    })),
                    specialInstructions: orderNotes || undefined,
                },
            },
            {
                onSuccess: (order) => {
                    cart.clear();
                    setCartOpen(false);
                    setPlacedOrder(order);
                },
            },
        );
    };

    const placeOrderError =
        placeOrder.error && typeof placeOrder.error === "object" && "message" in placeOrder.error
            ? String(placeOrder.error.message)
            : undefined;

    return (
        <>
            <main className={`mx-auto min-h-screen max-w-lg ${cart.itemCount > 0 ? "pb-28" : "pb-8"}`}>
                <header className="sticky top-0 z-30 border-b border-stone-200/80 bg-stone-50/90 px-6 py-5 backdrop-blur-md">
                    <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                        Orderly
                    </p>
                    <h1 className="mt-1 text-2xl font-bold text-stone-900">{restaurant.name}</h1>
                    <div className="mt-3 inline-flex items-center rounded-full bg-white px-3 py-1 text-sm font-medium text-stone-700 shadow-sm ring-1 ring-stone-200">
                        Table {table.tableNumber}
                    </div>
                </header>

                <div className="px-6 pt-6">
                    {menus.length === 0 ? (
                        <p className="rounded-2xl bg-white p-6 text-center text-stone-500 shadow-sm">
                            No menus available right now.
                        </p>
                    ) : (
                        menus.map((menu) => (
                            <section key={menu.id} className="mb-10">
                                <div className="mb-4">
                                    <h2 className="text-xl font-bold text-stone-900">{menu.name}</h2>
                                    {menu.description && (
                                        <p className="mt-1 text-sm text-stone-500">{menu.description}</p>
                                    )}
                                </div>

                                <ul className="space-y-4">
                                    {(menu.items ?? [])
                                        .filter((item) => item.isAvailable !== false)
                                        .map((item) => {
                                            const quantity = cart.getQuantity(item.id);
                                            return (
                                                <li key={item.id}>
                                                    <MenuItemCard
                                                        item={item}
                                                        quantity={quantity}
                                                        onAdd={() =>
                                                            cart.addItem({
                                                                menuItemId: item.id,
                                                                name: item.name,
                                                                price: item.price,
                                                            })
                                                        }
                                                        onIncrement={() =>
                                                            cart.updateQuantity(item.id, quantity + 1)
                                                        }
                                                        onDecrement={() =>
                                                            cart.updateQuantity(item.id, quantity - 1)
                                                        }
                                                    />
                                                </li>
                                            );
                                        })}
                                </ul>
                            </section>
                        ))
                    )}
                </div>
            </main>

            {cart.itemCount > 0 && (
                <CartBar
                    itemCount={cart.itemCount}
                    subtotal={cart.subTotal}
                    onOpen={() => setCartOpen(true)}
                />
            )}

            <CartDrawer
                open={cartOpen}
                lines={cart.lines}
                subtotal={cart.subTotal}
                isSubmitting={placeOrder.isPending}
                errorMessage={placeOrderError}
                onClose={() => setCartOpen(false)}
                onUpdateQuantity={cart.updateQuantity}
                onSubmit={handlePlaceOrder}
            />
        </>
    );
}