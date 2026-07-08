import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary via-white to-secondary px-4">
      <div className="w-full max-w-xl rounded-3xl bg-white/95 p-10 shadow-2xl shadow-slate-900/15">
        <h1 className="text-4xl font-bold text-primary">Emergencias MP</h1>
        <p className="mt-4 text-slate-600">Accede con Google para gestionar emergencias, productores y DDJJ.</p>
        <button
          onClick={handleLogin}
          className="mt-10 inline-flex w-full items-center justify-center rounded-xl bg-primary px-6 py-3 text-white transition hover:bg-secondary"
        >
          Ingresar con Google
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
