# Publicação na Vercel — TOP BURGER OS

O projeto foi ajustado para Node.js 22 e renderização dinâmica das rotas, evitando falhas de pré-renderização quando páginas usam Supabase/sessão.

## Variáveis obrigatórias na Vercel
Cadastre em **Produção, Prévia e Desenvolvimento**:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL` (use a URL pública final do projeto)

Opcional:
- `NEXT_PUBLIC_ROOT_DOMAIN` (somente se usar subdomínios próprios)

Depois faça um **Redeploy**.

> O arquivo `.env.local` não deve ser enviado ao Git nem compartilhado.
