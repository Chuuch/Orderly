type PageBackdropProps = {
    variant?: "admin" | "auth";
};

export function PageBackdrop({ variant = "admin" }: PageBackdropProps) {
    return (
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
            <div className="absolute inset-0 bg-[#070b10]" />
            <div className="absolute inset-0 bg-grid opacity-40" />
            <div className="glow-orb-emerald absolute -left-24 top-0 h-96 w-96 rounded-full blur-3xl" />
            <div className="glow-orb-cyan absolute right-0 top-1/3 h-[28rem] w-[28rem] rounded-full blur-3xl" />
            {variant === "auth" && (
                <>
                    <div className="absolute bottom-0 left-1/3 h-72 w-72 rotate-12 rounded-[3rem] border border-white/5 bg-white/[0.02]" />
                    <div className="absolute right-16 top-24 h-40 w-40 -rotate-6 rounded-full border border-emerald-400/10" />
                </>
            )}
        </div>
    );
}