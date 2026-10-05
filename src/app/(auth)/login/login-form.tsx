"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { Notice } from "@/components/ui/states";
import { signInAction } from "../actions";

export function LoginForm({ next, reset }: { next?: string; reset?: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  return (
    <form
      className="animate-pop-in"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        start(async () => {
          const res = await signInAction({ email, password, next });
          if (!res.ok) return setError(res.error ?? "Não foi possível entrar");
          router.push(res.data?.next ?? "/app");
          router.refresh();
        });
      }}
    >
      <h1 className="font-display text-[26px] font-semibold tracking-[-0.02em]">Entrar no painel</h1>
      <p className="mt-1 text-sm text-muted">Use o e-mail cadastrado pela sua hamburgueria.</p>
      {reset && <Notice tone="success" className="mt-5">Senha alterada. Entre com a nova senha.</Notice>}
      {error && <Notice tone="error" className="mt-5">{error}</Notice>}
      <div className="mt-6 space-y-4">
        <Field label="E-mail" htmlFor="email">
          <Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-11" />
        </Field>
        <Field label="Senha" htmlFor="password" hint={<Link href="/esqueci-senha" className="text-ember-600 hover:underline">Esqueci a senha</Link>}>
          <div className="relative">
            <Input id="password" type={show ? "text" : "password"} autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="h-11 pr-16" />
            <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs font-medium text-muted hover:text-ink">
              {show ? "Ocultar" : "Mostrar"}
            </button>
          </div>
        </Field>
      </div>
      <Button type="submit" variant="dark" size="lg" block loading={pending} className="mt-6">
        Entrar
      </Button>
      <p className="mt-6 text-center text-sm text-muted">
        Ainda não usa o TOP BURGER OS?{" "}
        <Link href="/cadastro" className="font-medium text-ember-600 hover:underline">
          Teste grátis por 14 dias
        </Link>
      </p>
    </form>
  );
}
