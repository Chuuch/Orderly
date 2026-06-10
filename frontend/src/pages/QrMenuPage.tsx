import { useQrContext } from "@/hooks/queries/useQrContext";
import { useParams } from "react-router-dom";

export function QrMenuPage() {
    const { qrToken } = useParams<{ qrToken: string }>();
    const { data, isPending, isError, error } = useQrContext(qrToken);


    if (isPending) {
        return <p className="p-6">Loading menu...</p>
    }

    if (isError) {
        const message =
        error && typeof error === 'object' && 'message' in error
        ? String((error as { message: string }).message)
        : 'Failed to load menu';
        return <p className="p-6 text-red-600">{message}</p>
    }

    if (!data) {
        return <p className="p-6">No data</p>
    }

    const { restaurant, table, menus } = data;

    return (
        <main className="mx-auto max-w-lg p-6">
          <header className="mb-6">
            <h1 className="text-2xl font-semibold">{restaurant.name}</h1>
            <p className="text-sm text-gray-600">Table {table.tableNumber}</p>
          </header>
          {menus.length === 0 ? (
            <p>No menus available.</p>
          ) : (
            menus.map((menu) => (
              <section key={menu.id} className="mb-8">
                <h2 className="mb-1 text-xl font-medium">{menu.name}</h2>
                {menu.description && (
                  <p className="mb-4 text-sm text-gray-600">{menu.description}</p>
                )}
                <ul className="space-y-3">
                  {(menu.items ?? [])
                    .filter((item) => item.isAvailable)
                    .map((item) => (
                      <li
                        key={item.id}
                        className="flex items-start justify-between rounded border p-3"
                      >
                        <div>
                          <p className="font-medium">{item.name}</p>
                          {item.description && (
                            <p className="text-sm text-gray-600">{item.description}</p>
                          )}
                        </div>
                        <p className="font-medium">{item.price.toFixed(2)}</p>
                      </li>
                    ))}
                </ul>
              </section>
            ))
          )}
        </main>
      )
}