import type { TableResponse } from "@/types/restaurant"
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import { buildTableQrUrl } from "@/lib/qr-url";

type TableQrCardProps = {
    table: TableResponse;
}

const STATUS_STYLES: Record<string, string> = {
    AVAILABLE: "bg-emerald-500 text-emerald-800",
    OCCUPIED: "bg-amber-50 text-amber-800",
    RESERVED: "bg-stone-50 text-stone-800",
};

export function TableQrCard({ table }: TableQrCardProps) {
    const qrUrl = buildTableQrUrl(table.qrCodeToken);
    const [copied, setCopied] = useState<boolean>(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(qrUrl);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
    };

    return (
        <article className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h3 className="text-lg font-semibold text-stone-900">
                        Table {table.tableNumber}
                    </h3>
                    <span
                        className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[table.status] ?? "bg-stone-100 text-stone-700"}`}
                    >
                        {table.status}
                    </span>
                </div>
                <div className="rounded-xl border border-stone-100 bg-white p-2">
                    <QRCodeSVG value={qrUrl} size={112} level="M" />
                </div>
            </div>
            <p className="mt-4 break-all text-xs text-stone-500">{qrUrl}</p>
            <div className="mt-4 flex gap-2">
                <button
                    type="button"
                    onClick={handleCopy}
                    className="flex-1 rounded-xl bg-stone-900 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-800"
                >
                    {copied ? "Copied!" : "Copy link"}
                </button>
                <a
                    href={qrUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
                >
                    Open
                </a>
            </div>
        </article>
    )
}