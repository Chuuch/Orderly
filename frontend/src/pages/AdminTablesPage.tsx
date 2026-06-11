import { TableQrCard } from "@/components/tables/TableQrCard";
import { useRestaurantTables } from "@/hooks/queries/useRestaurantTables";
import { useTableMutations } from "@/hooks/queries/useTableMutations";
import { useState, type SubmitEventHandler } from "react";

export function AdminTablesPage() {
    const { data: tables, isPending, isError, error } = useRestaurantTables();
    const { createTable } = useTableMutations();
    const [tableNumber, setTableNumber] = useState("");

    const handleCreateTable: SubmitEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        const trimmed = tableNumber.trim();
        if (!trimmed) return;

        createTable.mutate(
            { tableNumber: trimmed },
            {
                onSuccess: () => setTableNumber(""),
            },
        );
    };

    const sortedTables = [...(tables ?? [])].sort((a, b) =>
        a.tableNumber.localeCompare(b.tableNumber, undefined, { numeric: true }),
    );

    if (isPending) {
        return (
            <div className="flex min-h-[40vh] items-center justify-center">
                <p className="text-sm text-stone-500">Loading tables…</p>
            </div>
        );
    }

    if (isError) {
        const message =
            error && typeof error === "object" && "message" in error
                ? String((error as { message: string }).message)
                : "Failed to load tables";
        return (
            <p className="rounded-2xl bg-red-50 px-4 py-3 text-red-700">{message}</p>
        );
    }

    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-3xl font-bold text-stone-900">Tables</h1>
                <p className="mt-1 text-sm text-stone-600">
                    Create tables and share QR codes for customer ordering.
                </p>
            </div>

            <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-stone-900">Add table</h2>
                <form onSubmit={handleCreateTable} className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <input
                        className="flex-1 rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                        placeholder="Table number (e.g. 5)"
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        maxLength={10}
                        required
                    />
                    <button
                        type="submit"
                        disabled={createTable.isPending}
                        className="rounded-xl bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-300"
                    >
                        {createTable.isPending ? "Creating…" : "Create table"}
                    </button>
                </form>

                {createTable.isError && (
                    <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
                        {createTable.error.message}
                    </p>
                )}
            </section>

            <section>
                <h2 className="text-lg font-semibold text-stone-900">
                    {sortedTables.length} table{sortedTables.length === 1 ? "" : "s"}
                </h2>

                {sortedTables.length === 0 ? (
                    <p className="mt-4 rounded-2xl border border-dashed border-stone-200 bg-white px-4 py-8 text-center text-sm text-stone-500">
                        No tables yet. Create your first table above.
                    </p>
                ) : (
                    <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {sortedTables.map((table) => (
                            <TableQrCard key={table.id} table={table} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}