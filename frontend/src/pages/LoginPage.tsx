import { useLogin } from "@/hooks/queries/useLogin";
import { useAuth } from "@/hooks/useAuth";
import { PageBackdrop } from "@/components/ui/PageBackdrop";
import { GlassCard } from "@/components/ui/GlassCard";
import { getDefaultRoute } from "@/lib/roles";
import { useEffect, type SubmitEventHandler } from "react";
import { useNavigate } from "react-router-dom";

export function LoginPage() {
    const login = useLogin();
    const navigate = useNavigate();
    const { session, isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated && session?.roles) {
            navigate(getDefaultRoute(session.roles), { replace: true });
        }
    }, [isAuthenticated, session, navigate]);

    const onSubmit: SubmitEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        login.mutate(
            {
                email: String(data.get("email")),
                password: String(data.get("password")),
            },
            {
                onSuccess: (auth) => navigate(getDefaultRoute(auth.roles), { replace: true }),
            },
        );
    };

    return (
        <>
            <PageBackdrop variant="auth" />
            <main className="relative flex min-h-screen items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">
                    <div className="mb-8 text-center">
                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400/80">
                            Orderly
                        </p>
                        <h1 className="mt-3 text-3xl font-bold tracking-tight text-white">
                            Welcome back
                        </h1>
                        <p className="mt-2 text-sm text-zinc-400">
                            Sign in to manage your restaurant
                        </p>
                    </div>

                    <GlassCard className="p-8">
                        <form onSubmit={onSubmit} className="space-y-4">
                            <input className="field" type="email" name="email" placeholder="Email" required />
                            <input className="field" type="password" name="password" placeholder="Password" required />
                            {login.error && (
                                <p className="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-300">
                                    {login.error.message}
                                </p>
                            )}
                            <button type="submit" disabled={login.isPending} className="btn-primary w-full">
                                {login.isPending ? "Signing in…" : "Sign in"}
                            </button>
                        </form>
                    </GlassCard>
                </div>
            </main>
        </>
    );
}