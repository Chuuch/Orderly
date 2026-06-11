import { TableQrCard } from "@/components/tables/TableQrCard";
import { GlassCard } from "@/components/ui/GlassCard";
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
                <p className="text-sm text-zinc-400">Loading tables…</p>
            </div>
        );
    }

    if (isError) {
        const message =
            error && typeof error === "object" && "message" in error
                ? String((error as { message: string }).message)
                : "Failed to load tables";
        return (
            <p className="rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-300">{message}</p>
        );
    }

    return (
        <div className="space-y-10">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400/80">
                    Floor
                </p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">Tables</h1>
                <p className="mt-2 text-sm text-zinc-400">
                    Create tables and share QR codes for customer ordering.
                </p>
            </div>

            <GlassCard className="p-6">
                <h2 className="text-lg font-semibold text-white">Add table</h2>
                <form onSubmit={handleCreateTable} className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <input
                        className="field flex-1"
                        placeholder="Table number (e.g. 5)"
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        maxLength={10}
                        required
                    />
                    <button type="submit" disabled={createTable.isPending} className="btn-primary">
                        {createTable.isPending ? "Creating…" : "Create table"}
                    </button>
                </form>

                {createTable.isError && (
                    <p className="mt-3 rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-300">
                        {createTable.error.message}
                    </p>
                )}
            </GlassCard>

            <section>
                <h2 className="text-lg font-semibold text-white">
                    {sortedTables.length} table{sortedTables.length === 1 ? "" : "s"}
                </h2>

                {sortedTables.length === 0 ? (
                    <p className="mt-4 rounded-2xl border border-dashed border-white/10 bg-white/5 px-4 py-8 text-center text-sm text-zinc-400">
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
