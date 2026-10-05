import { LinkButton } from "@/components/ui/button";
import { Icon } from "@/components/ui/icons";
import { Card } from "@/components/ui/layout";
import { requireOrg } from "@/lib/auth";
import { money } from "@/lib/format";
import { FEATURE_LABELS, FEATURE_PLAN, type Feature } from "@/lib/permissions";
import { createClient } from "@/lib/supabase/server";

const NAMES: Record<string, string> = FEATURE_LABELS;

export default async function PlanGatePage({ searchParams }: { searchParams: Promise<{ recurso?: string }> }) {
  const ctx = await requireOrg();
  const { recurso } = await searchParams;
  const supabase = await createClient();
  const { data: plans } = await supabase.from("plans").select("code, name, price, features, description").eq("is_active", true).order("sort");
  const feature = (recurso ?? "") as Feature;
  return (
    <div className="mx-auto max-w-3xl py-6">
      <div className="text-center">
        <span className="inline-grid h-12 w-12 place-items-center rounded-lg bg-mustard-50 text-mustard-700">
          <Icon name="lock" size={22} />
        </span>
        <h1 className="mt-4 font-display text-2xl font-semibold">{NAMES[feature] ?? "Recurso"} faz parte do plano {FEATURE_PLAN[feature] ?? "superior"}</h1>
        <p className="mt-2 text-sm text-muted">
          Sua empresa está no plano <b className="text-ink">{ctx.subscription?.plan_name ?? "—"}</b>. Fale com o suporte do TOP BURGER OS para fazer upgrade — seus dados continuam onde estão.
        </p>
      </div>
      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {(plans ?? []).map((p: { code: string; name: string; price: number; features: string[]; description: string | null }) => (
          <Card key={p.code} className={p.features.includes(feature) ? "ring-2 ring-ember-500" : ""}>
            <p className="font-display text-lg font-semibold">{p.name}</p>
            <p className="num mt-1 text-2xl font-semibold">{money(p.price)}<span className="text-sm font-normal text-muted">/mês</span></p>
            <p className="mt-1 text-xs text-muted">{p.description}</p>
            <p className={`mt-3 text-xs font-medium ${p.features.includes(feature) ? "text-pickle-700" : "text-faint"}`}>
              {p.features.includes(feature) ? "✓ inclui este recurso" : "não inclui"}
            </p>
          </Card>
        ))}
      </div>
      <div className="mt-6 text-center">
        <LinkButton href="/app" variant="secondary">Voltar ao painel</LinkButton>
      </div>
    </div>
  );
}
