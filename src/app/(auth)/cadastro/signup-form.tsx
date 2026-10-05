"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { Icon } from "@/components/ui/icons";
import { Notice } from "@/components/ui/states";
import { slugify } from "@/lib/format";
import { checkSlugAction, signUpAction } from "../actions";

export function SignUpForm() {
  const router = useRouter();
  const [form, setForm] = useState({ fullName: "", email: "", password: "", storeName: "", slug: "" });
  const [slugTouched, setSlugTouched] = useState(false);
  const [slugOk, setSlugOk] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [pending, start] = useTransition();

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    if (!slugTouched) setForm((f) => ({ ...f, slug: slugify(f.storeName) }));
  }, [form.storeName, slugTouched]);

  useEffect(() => {
    if (!form.slug) return setSlugOk(null);
    const t = setTimeout(async () => {
      const res = await checkSlugAction(form.slug);
      setSlugOk(res.ok ? Boolean(res.data) : null);
    }, 400);
    return () => clearTimeout(t);
  }, [form.slug]);

  if (sent) {
    return (
      <div className="animate-pop-in">
        <div className="mb-4 grid h-12 w-12 place-items-center rounded-lg bg-pickle-50 text-pickle-500">
          <Icon name="send" size={22} />
        </div>
        <h1 className="font-display text-[26px] font-semibold tracking-[-0.02em]">Confirme seu e-mail</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Enviamos um link para <b className="text-ink">{form.email}</b>. Ao confirmar, você volta direto para configurar a <b className="text-ink">{form.storeName}</b>.
        </p>
        <Link href="/login" className="mt-6 inline-block text-sm font-medium text-ember-600 hover:underline">
          Já confirmei — entrar
        </Link>
      </div>
    );
  }

  return (
    <form
      className="animate-pop-in"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        start(async () => {
          const res = await signUpAction(form);
          if (!res.ok) return setError(res.error ?? "Não foi possível criar a conta");
          if (res.data?.needsConfirmation) return setSent(true);
          router.push("/onboarding");
          router.refresh();
        });
      }}
    >
      <h1 className="font-display text-[26px] font-semibold tracking-[-0.02em]">Comece a vender hoje</h1>
      <p className="mt-1 text-sm text-muted">14 dias grátis. Sem cartão de crédito.</p>
      {error && <Notice tone="error" className="mt-5">{error}</Notice>}
      <div className="mt-6 space-y-4">
        <Field label="Nome da hamburgueria" htmlFor="store" required>
          <Input id="store" required value={form.storeName} onChange={(e) => set("storeName", e.target.value)} placeholder="Ex.: Brasa Burger" className="h-11" />
        </Field>
        <Field
          label="Endereço do cardápio"
          htmlFor="slug"
          required
          error={slugOk === false ? "Endereço indisponível" : null}
          help={form.slug ? <span className="font-mono">/{form.slug}</span> : "Será o link do seu cardápio online"}
        >
          <Input
            id="slug"
            required
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true);
              set("slug", slugify(e.target.value));
            }}
            suffix={slugOk === true ? "✓ livre" : undefined}
            invalid={slugOk === false}
            className="h-11 font-mono"
          />
        </Field>
        <Field label="Seu nome" htmlFor="name" required>
          <Input id="name" autoComplete="name" required value={form.fullName} onChange={(e) => set("fullName", e.target.value)} className="h-11" />
        </Field>
        <Field label="E-mail" htmlFor="email" required>
          <Input id="email" type="email" autoComplete="email" required value={form.email} onChange={(e) => set("email", e.target.value)} className="h-11" />
        </Field>
        <Field label="Senha" htmlFor="password" required help="Mínimo de 8 caracteres">
          <Input id="password" type="password" autoComplete="new-password" required minLength={8} value={form.password} onChange={(e) => set("password", e.target.value)} className="h-11" />
        </Field>
      </div>
      <Button type="submit" variant="primary" size="lg" block loading={pending} disabled={slugOk === false} className="mt-6">
        Criar minha conta
      </Button>
      <p className="mt-6 text-center text-sm text-muted">
        Já tem conta?{" "}
        <Link href="/login" className="font-medium text-ember-600 hover:underline">
          Entrar
        </Link>
      </p>
    </form>
  );
}
