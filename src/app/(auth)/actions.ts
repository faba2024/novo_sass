"use server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { run, fail } from "@/lib/action";
import { env } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Informe um e-mail válido"),
  password: z.string().min(1, "Informe a senha"),
});

export async function signInAction(input: { email: string; password: string; next?: string }) {
  return run(async () => {
    const data = loginSchema.parse(input);
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword(data);
    if (error) {
      if (/confirm/i.test(error.message)) fail("Confirme seu e-mail antes de entrar (veja sua caixa de entrada).");
      fail("E-mail ou senha incorretos.");
    }
    const next = input.next && input.next.startsWith("/") && !input.next.startsWith("//") ? input.next : "/app";
    return { next };
  });
}

const signUpSchema = z.object({
  fullName: z.string().trim().min(2, "Informe seu nome"),
  email: z.string().trim().toLowerCase().email("Informe um e-mail válido"),
  password: z.string().min(8, "A senha precisa de pelo menos 8 caracteres"),
  storeName: z.string().trim().min(2, "Informe o nome da hamburgueria").max(80),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]([a-z0-9-]{0,38}[a-z0-9])?$/, "Use apenas letras minúsculas, números e hífen"),
});

export async function checkSlugAction(slug: string) {
  return run(async () => {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("slug_available", { p_slug: slug });
    if (error) throw error;
    return Boolean(data);
  });
}

export async function signUpAction(input: z.input<typeof signUpSchema>) {
  return run(async () => {
    const data = signUpSchema.parse(input);
    const supabase = await createClient();
    const { data: platform } = await supabase.rpc("platform_public");
    if ((platform as { signup_enabled?: boolean } | null)?.signup_enabled === false) fail("Novos cadastros estão temporariamente fechados. Fale com o suporte.");
    const { data: available } = await supabase.rpc("slug_available", { p_slug: data.slug });
    if (!available) fail("Este endereço já está em uso. Escolha outro.");

    const { data: auth, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${env.appUrl}/auth/callback?next=/onboarding`,
        data: { full_name: data.fullName, pending_org_name: data.storeName, pending_org_slug: data.slug },
      },
    });
    if (error) {
      if (/registered|exists/i.test(error.message)) fail("Este e-mail já tem conta. Entre com sua senha.");
      fail(error.message);
    }
    if (!auth.session) return { needsConfirmation: true as const };

    const { error: orgError } = await supabase.rpc("create_my_organization", { p_name: data.storeName, p_slug: data.slug });
    if (orgError) throw orgError;
    return { needsConfirmation: false as const };
  });
}

export async function requestPasswordResetAction(email: string) {
  return run(async () => {
    const parsed = z.string().trim().toLowerCase().email("Informe um e-mail válido").parse(email);
    const supabase = await createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(parsed, { redirectTo: `${env.appUrl}/auth/callback?next=/redefinir-senha` });
    if (error) fail(error.message);
    return true;
  });
}

export async function updatePasswordAction(password: string) {
  return run(async () => {
    const parsed = z.string().min(8, "A senha precisa de pelo menos 8 caracteres").parse(password);
    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({ password: parsed });
    if (error) fail(error.message);
    return true;
  });
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
