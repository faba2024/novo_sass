import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** Tipos de OTP aceitos pelo Supabase Auth. */
type VerifyOtpType =
  | "signup"
  | "invite"
  | "magiclink"
  | "recovery"
  | "email_change"
  | "email"
  | "sms"
  | "phone_change";

const VERIFY_OTP_TYPES = new Set<VerifyOtpType>([
  "signup",
  "invite",
  "magiclink",
  "recovery",
  "email_change",
  "email",
  "sms",
  "phone_change",
]);

function isVerifyOtpType(value: string | null): value is VerifyOtpType {
  return value !== null && VERIFY_OTP_TYPES.has(value as VerifyOtpType);
}

/** Retorno dos links de e-mail do Supabase (confirmação de cadastro e recuperação de senha). */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");
  const nextParam = url.searchParams.get("next") ?? "/app";
  const next =
    nextParam.startsWith("/") && !nextParam.startsWith("//")
      ? nextParam
      : "/app";

  const supabase = await createClient();

  let ok = false;

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    ok = !error;
  } else if (tokenHash && isVerifyOtpType(type)) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type,
    });
    ok = !error;
  }

  if (!ok) {
    return NextResponse.redirect(new URL("/login?erro=link", url.origin));
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
