import SiteHeader from "../components/site/SiteHeader";
import SiteFooter from "../components/site/SiteFooter";
import WhatsAppFloatingButton from "../components/site/WhatsAppFloatingButton";

export default function Privacy() {
  return (
    <div className="min-h-dvh bg-lohn-light text-lohn-ink">
      <SiteHeader />

      <main className="mx-auto w-full max-w-4xl px-4 py-14 md:py-20">
        <h1 className="text-3xl font-semibold tracking-tight text-lohn-ink">
          Política de Privacidade
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-lohn-ink/80">
          Esta página descreve, de forma objetiva, como o site LOHN Advocacia utiliza cookies e dados
          para operar.
        </p>

        <div className="mt-8 space-y-6 text-sm text-lohn-ink/80">
          <section>
            <h2 className="text-lg font-semibold text-lohn-ink">1) Cookies e armazenamento local</h2>
            <p className="mt-2 leading-relaxed">
              Utilizamos armazenamento local/cookies para registrar preferências (ex.: consentimento
              de cookies) e manter a navegação funcional.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-lohn-ink">2) Tagueamento (analytics)</h2>
            <p className="mt-2 leading-relaxed">
              Com seu consentimento, registramos eventos de navegação (ex.: páginas acessadas, cliques
              em botões e tempo aproximado com a página ativa) para fins estatísticos e melhoria do
              site. Esses registros são armazenados no Supabase.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-lohn-ink">3) Contato</h2>
            <p className="mt-2 leading-relaxed">
              Quando você envia um contato pelo site, os dados informados (nome, telefone, assunto e
              mensagem) podem ser encaminhados por e-mail para viabilizar o atendimento.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-lohn-ink">4) Atualizações</h2>
            <p className="mt-2 leading-relaxed">
              Esta política pode ser atualizada a qualquer momento para refletir mudanças no site.
            </p>
          </section>
        </div>
      </main>

      <SiteFooter />
      <WhatsAppFloatingButton />
    </div>
  );
}
