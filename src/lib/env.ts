export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  appUrl: (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  rootDomain: (process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "").toLowerCase(),
};

export function assertSupabaseEnv() {
  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    throw new Error(
      "Supabase não configurado: defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no .env.local (veja SETUP.md).",
    );
  }
}

/** URL pública da loja (subdomínio quando configurado, senão /slug). */
export function storeUrl(slug: string, path = "") {
  if (env.rootDomain) {
    const protocol = env.appUrl.startsWith("https") ? "https" : "http";
    return `${protocol}://${slug}.${env.rootDomain}${path}`;
  }
  return `${env.appUrl}/${slug}${path}`;
}
