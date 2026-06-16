import { GlassCard } from "@/components/ui/GlassCard";
import { PageBackdrop } from "@/components/ui/PageBackdrop";
import { useOnboard } from "@/hooks/queries/useOnboard";
import { getDefaultRoute } from "@/lib/roles";
import { Link, useNavigate } from "react-router-dom";
import type { SubmitEventHandler } from "react";

export function SignupPage() {
    const onboard = useOnboard();
    const navigate = useNavigate();

    const onSubmit: SubmitEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);

        onboard.mutate(
            {
                restaurantName: String(data.get("restaurantName")),
                subdomain: String(data.get("subdomain")).toLowerCase().trim(),
                address: String(data.get("address") || "") || undefined,
                phoneNumber: String(data.get("phoneNumber") || "") || undefined,
                firstName: String(data.get("firstName")),
                lastName: String(data.get("lastName")),
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
                <div className="w-full max-w-lg">
                    <div className="mb-8 text-center">
                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400/80">
                            Orderly
                        </p>
                        <h1 className="mt-3 text-3xl font-bold text-white">Create your restaurant</h1>
                    </div>

                    <GlassCard className="p-8">
                        <form onSubmit={onSubmit} className="space-y-4">
                            <input className="field" name="restaurantName" placeholder="Restaurant name" required />
                            <input
                                className="field"
                                name="subdomain"
                                placeholder="Subdomain (e.g. my-bistro)"
                                pattern="[a-z0-9-]+"
                                title="Lowercase letters, numbers, and hyphens only"
                                required
                            />
                            <input className="field" name="address" placeholder="Address (optional)" />
                            <input className="field" name="phoneNumber" placeholder="Phone (optional)" />

                            <hr className="border-white/10" />

                            <div className="grid gap-4 sm:grid-cols-2">
                                <input className="field" name="firstName" placeholder="First name" required />
                                <input className="field" name="lastName" placeholder="Last name" required />
                            </div>
                            <input className="field" type="email" name="email" placeholder="Admin email" required />
                            <input
                                className="field"
                                type="password"
                                name="password"
                                placeholder="Password (min 8 chars)"
                                minLength={8}
                                required
                            />

                            {onboard.error && (
                                <p className="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-300">
                                    {onboard.error.message}
                                </p>
                            )}

                            <button type="submit" disabled={onboard.isPending} className="btn-primary w-full">
                                {onboard.isPending ? "Creating…" : "Create account"}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm text-zinc-400">
                            Already have an account?{" "}
                            <Link to="/login" className="text-emerald-400 hover:text-emerald-300">
                                Sign in
                            </Link>
                        </p>
                    </GlassCard>
                </div>
            </main>
        </>
    );
}