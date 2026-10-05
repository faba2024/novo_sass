import { PageHeader } from "@/components/ui/layout";
import { createClient } from "@/lib/supabase/server";
import { PlatformSettingsForm } from "./settings-form";

export const metadata = { title: "Configurações da plataforma" };

export default async function PlatformSettingsPage() {
  const supabase = await createClient();
  const [{ data: rows }, { data: plans }] = await Promise.all([
    supabase.from("platform_settings").select("key, value"),
    supabase.from("plans").select("code, name").eq("is_active", true).order("sort"),
  ]);
  const get = (k: string) => ((rows ?? []) as { key: string; value: Record<string, unknown> }[]).find((r) => r.key === k)?.value ?? {};
  const signup = get("signup") as { enabled?: boolean; plan_code?: string; trial_days?: number };
  const support = get("support") as { whatsapp?: string | null; email?: string | null; hours?: string | null };
  return (
    <>
      <PageHeader eyebrow="Plataforma" title="Configurações" description="Regras de cadastro e contatos de suporte exibidos na página inicial." />
      <PlatformSettingsForm
        plans={(plans ?? []) as { code: string; name: string }[]}
        initial={{
          signup: { enabled: signup.enabled ?? true, plan_code: signup.plan_code ?? "STARTER", trial_days: signup.trial_days ?? 14 },
          support: { whatsapp: support.whatsapp ?? "", email: support.email ?? "", hours: support.hours ?? "" },
        }}
      />
    </>
  );
}
