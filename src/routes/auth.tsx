import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import heroImg from "@/assets/pousada-hero.jpg";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Entrar — Pousada Ilha do Meio" }] }),
  component: AuthPage,
});

function AuthPage() {
  const [email, setEmail] = useState("recepcao@ilhadomeio.com.br");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error: signErr } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/dashboard` },
        });
        if (signErr) throw signErr;
        const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
        if (signInErr) throw signInErr;
        const { error: claimErr } = await supabase.rpc("claim_first_admin" as never);
        if (claimErr && !/admin_already_exists/.test(claimErr.message)) {
          toast.error("Conta criada, mas falha ao conceder admin: " + claimErr.message);
        } else {
          toast.success("Conta administradora criada.");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Falha ao autenticar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:block relative">
        <img src={heroImg} alt="Pousada Ilha do Meio" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
        <div className="absolute bottom-10 left-10 right-10 text-primary-foreground">
          <div className="font-display text-4xl leading-tight max-w-md">
            "O mar de Itacimirim recebe quem chega para descansar."
          </div>
          <div className="mt-3 text-sm opacity-80 tracking-wide">PMS interno · operação 2026</div>
        </div>
      </div>

      <div className="flex items-center justify-center p-8 bg-secondary">
        <form onSubmit={submit} className="w-full max-w-sm space-y-6">
          <div className="flex flex-col items-center text-center gap-3">
            <Logo className="h-20 w-20" />
            <div>
              <div className="font-display text-2xl font-semibold">Pousada Ilha do Meio</div>
              <div className="text-xs text-muted-foreground tracking-[0.2em] uppercase mt-1">Painel operacional</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Aguarde…" : mode === "signup" ? "Criar conta admin" : "Entrar no painel"}
          </Button>

          <button
            type="button"
            className="w-full text-xs text-muted-foreground underline-offset-2 hover:underline"
            onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
          >
            {mode === "signup" ? "Já tenho conta — entrar" : "Criar primeira conta administradora"}
          </button>

          <p className="text-[11px] text-muted-foreground text-center">
            A opção de criar conta só funciona uma vez (primeiro admin). Demais contas pelo painel.
          </p>
        </form>
      </div>
    </div>
  );
}
