import { useLogin } from "@/hooks/queries/useLogin";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, type SubmitEventHandler } from "react";
import { useNavigate } from "react-router-dom";

export function LoginPage() {
    const login = useLogin();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/admin', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const onSubmit: SubmitEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        login.mutate({
            email: String(data.get('email')),
            password: String(data.get('password')),
        }, {
            onSuccess: () => navigate('/admin', { replace: true }),
        },
        )
    }

    const error = login.error;

    return (
        <form onSubmit={onSubmit} className="mx-auto mt-20 flex max-w-sm flex-col gap-3 p-6">
            <h1 className="text-xl font-semibold">Login</h1>
            <input type="email" name="email" placeholder="Email" required />
            <input type="password" name="password" placeholder="Password" required />
            {error && <p>{error.message}</p>}
            <button type="submit" disabled={login.isPending}>
                {login.isPending ? 'Signing in...' : 'Login'}
            </button>
        </form>
    )
}