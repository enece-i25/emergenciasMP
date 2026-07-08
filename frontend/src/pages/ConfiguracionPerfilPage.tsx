import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

type ProfileFormState = {
  cuit_cuil: string;
  nombre: string;
  domicilio: string;
};

function ConfiguracionPerfilPage() {
  const { user, refresh } = useAuth();
  const [form, setForm] = useState<ProfileFormState>({ cuit_cuil: '', nombre: '', domicilio: '' });
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user?.productor) {
      setForm({
        cuit_cuil: user.productor.cuit_cuil || '',
        nombre: user.productor.nombre || '',
        domicilio: user.productor.domicilio || '',
      });
    }
  }, [user]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        setMessage('No se pudo guardar el perfil.');
        setIsSaving(false);
        return;
      }

      setMessage('Perfil actualizado correctamente.');
      await refresh();
    } catch (error) {
      setMessage('Error de conexión con el servidor.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
        <p className="text-sm uppercase tracking-[0.2em] text-secondary">Perfil</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Tus datos personales</h1>
        <p className="mt-2 text-sm text-slate-600">Edita tu nombre, DNI/CUIT y domicilio.</p>
      </header>

      <form className="grid gap-6" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">CUIT / CUIL / DNI</span>
            <input
              type="text"
              value={form.cuit_cuil}
              onChange={(e) => setForm({ ...form, cuit_cuil: e.target.value.replace(/\D/g, '') })}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Nombre completo</span>
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3"
              required
            />
          </label>

          <label className="block sm:col-span-2">
            <span className="text-sm font-semibold text-slate-700">Domicilio</span>
            <input
              type="text"
              value={form.domicilio}
              onChange={(e) => setForm({ ...form, domicilio: e.target.value })}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3"
              required
            />
          </label>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-600">Rol: {user?.rol || 'Desconocido'}</p>
          </div>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center justify-center rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>

        {message ? <p className="text-sm text-slate-600">{message}</p> : null}
      </form>
    </div>
  );
}

export default ConfiguracionPerfilPage;
