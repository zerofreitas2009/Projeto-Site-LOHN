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
    <div className="min-h-dvh bg-white text-neutral-900">
      <div className="mx-auto w-full max-w-md px-4 py-14">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
          Acesso administrativo
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          Entre para aprovar ou remover avaliações enviadas pelo site.
        </p>

        <div className="mt-8 rounded-2xl border border-gold/15 bg-white p-4 shadow-sm">
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
