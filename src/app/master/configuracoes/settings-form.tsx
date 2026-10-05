"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox, Field, Input, Select } from "@/components/ui/field";
import { Section } from "@/components/ui/layout";
import { useAction } from "@/hooks/use-action";
import { maskPhone } from "@/lib/format";
import { savePlatformSettingsAction } from "../actions";

type S = { signup: { enabled: boolean; plan_code: string; trial_days: number }; support: { whatsapp: string; email: string; hours: string } };

export function PlatformSettingsForm({ initial, plans }: { initial: S; plans: { code: string; name: string }[] }) {
  const { run, pending } = useAction();
  const [f, setF] = useState<S>({ ...initial, support: { ...initial.support, whatsapp: maskPhone(initial.support.whatsapp) } });
  return (
    <>
      <Section title="Cadastro de novas hamburguerias" description="Vale para quem se cadastra pela página inicial.">
        <div className="space-y-4">
          <Checkbox checked={f.signup.enabled} onChange={(v) => setF({ ...f, signup: { ...f.signup, enabled: v } })} label="Aceitar novos cadastros" description="Desligado: o formulário de cadastro informa que as inscrições estão fechadas." />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Plano do período de teste"><Select value={f.signup.plan_code} onChange={(e) => setF({ ...f, signup: { ...f.signup, plan_code: e.target.value } })}>{plans.map((p) => <option key={p.code} value={p.code}>{p.name}</option>)}</Select></Field>
            <Field label="Dias de teste grátis"><Input type="number" min={0} max={90} value={f.signup.trial_days} onChange={(e) => setF({ ...f, signup: { ...f.signup, trial_days: Number(e.target.value) } })} /></Field>
          </div>
        </div>
      </Section>
      <Section title="Suporte" description="Mostrado na página inicial e na tela de plano das empresas.">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="WhatsApp"><Input value={f.support.whatsapp} onChange={(e) => setF({ ...f, support: { ...f.support, whatsapp: maskPhone(e.target.value) } })} /></Field>
          <Field label="E-mail"><Input type="email" value={f.support.email} onChange={(e) => setF({ ...f, support: { ...f.support, email: e.target.value } })} /></Field>
          <Field label="Horário de atendimento"><Input value={f.support.hours} onChange={(e) => setF({ ...f, support: { ...f.support, hours: e.target.value } })} /></Field>
        </div>
      </Section>
      <div className="flex justify-end"><Button variant="dark" size="lg" loading={pending} onClick={() => run(() => savePlatformSettingsAction(f), { success: "Configurações salvas" })}>Salvar</Button></div>
    </>
  );
}
