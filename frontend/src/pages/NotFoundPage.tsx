import { PageBackdrop } from "@/components/ui/PageBackdrop";
import { GlassCard } from "@/components/ui/GlassCard";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
    return (
        <>
            <PageBackdrop variant="auth" />
            <main className="relative flex min-h-screen items-center justify-center px-6">
                <GlassCard className="max-w-md p-8 text-center">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400/80">
                        404
                    </p>
                    <h1 className="mt-3 text-2xl font-bold text-white">Page not found</h1>
                    <p className="mt-2 text-sm text-zinc-400">
                        The page you&apos;re looking for doesn&apos;t exist.
                    </p>
                    <Link to="/login" className="btn-primary mt-6 inline-block">
                        Go to login
                    </Link>
                </GlassCard>
            </main>
        </>
    );
}