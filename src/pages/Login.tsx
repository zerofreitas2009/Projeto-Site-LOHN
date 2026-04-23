import { useEffect } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { supabase } from "../integrations/supabase/client";
import { useSession } from "../components/auth/SessionProvider";

export default function Login() {
  const { session, loading } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (session) navigate("/admin", { replace: true });
  }, [loading, navigate, session]);

  return (
    <div className="min-h-dvh bg-lohn-light text-lohn-ink">
      <div className="mx-auto w-full max-w-md px-4 py-14">
        <h1 className="text-2xl font-semibold tracking-tight text-lohn-ink">
          Acesso administrativo
        </h1>
        <p className="mt-2 text-sm text-lohn-ink/70">
          Entre para aprovar ou remover avaliações enviadas pelo site.
        </p>

        <div className="mt-8 rounded-2xl border border-lohn-dark/15 bg-lohn-light/40 p-4 shadow-sm backdrop-blur">
          <Auth
            supabaseClient={supabase}
            providers={[]}
            appearance={{ theme: ThemeSupa }}
            theme="light"
          />
        </div>
      </div>
    </div>
  );
}