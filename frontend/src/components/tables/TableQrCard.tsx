import { GlassCard } from "@/components/ui/GlassCard";
import { buildTableQrUrl } from "@/lib/qr-url";
import type { TableResponse } from "@/types/restaurant";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";

type TableQrCardProps = {
    table: TableResponse;
};

const STATUS_STYLES: Record<string, string> = {
    AVAILABLE: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/20",
    OCCUPIED: "bg-amber-500/15 text-amber-300 ring-1 ring-amber-400/20",
    RESERVED: "bg-zinc-500/15 text-zinc-300 ring-1 ring-zinc-400/20",
};

export function TableQrCard({ table }: TableQrCardProps) {
    const qrUrl = buildTableQrUrl(table.qrCodeToken);
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(qrUrl);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
    };

    return (
        <GlassCard className="p-5">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h3 className="text-lg font-semibold text-white">Table {table.tableNumber}</h3>
                    <span
                        className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[table.status] ?? STATUS_STYLES.RESERVED}`}
                    >
                        {table.status}
                    </span>
                </div>
                <div className="rounded-xl border border-white/10 bg-white p-2">
                    <QRCodeSVG value={qrUrl} size={112} level="M" />
                </div>
            </div>

            <p className="mt-4 break-all text-xs text-zinc-500">{qrUrl}</p>

            <div className="mt-4 flex gap-2">
                <button type="button" onClick={handleCopy} className="btn-primary flex-1">
                    {copied ? "Copied!" : "Copy link"}
                </button>
                <a href={qrUrl} target="_blank" rel="noreferrer" className="btn-ghost">
                    Open
                </a>
            </div>
        </GlassCard>
    );
}
