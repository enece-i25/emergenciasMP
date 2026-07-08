import { useState } from 'react';

type ProfileFormState = {
  cuit_cuil: string;
  nombre: string;
  domicilio: string;
};

const initialForm: ProfileFormState = {
  cuit_cuil: '',
  nombre: '',
  domicilio: '',
};

const documentRegex = /^\d{1,11}$/;
const nameRegex = /^[\p{L}][\p{L}\s'.-]*$/u;

function ProfilePage() {
  const [form, setForm] = useState<ProfileFormState>(initialForm);

  const cuitCuilError = form.cuit_cuil.trim() && !documentRegex.test(form.cuit_cuil)
    ? 'Solo se permiten números.'
    : '';

  const nombreError = form.nombre.trim() && !nameRegex.test(form.nombre.trim())
    ? 'Solo se permiten letras, acentos, espacios, puntos y apóstrofos.'
    : '';

  const domicilioError = form.domicilio.trim() && form.domicilio.trim().length < 3
    ? 'Ingresa un domicilio válido.'
    : '';

  const isFormValid = Boolean(
    form.cuit_cuil.trim() &&
    form.nombre.trim() &&
    form.domicilio.trim() &&
    !cuitCuilError &&
    !nombreError &&
    !domicilioError
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!isFormValid) {
      return;
    }

    await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        ...form,
        cuit_cuil: form.cuit_cuil.trim(),
        nombre: form.nombre.trim(),
        domicilio: form.domicilio.trim(),
      }),
    });
    window.location.href = '/declaracion-jurada';
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto w-full max-w-3xl rounded-3xl bg-white p-10 shadow-lg">
        <h2 className="text-3xl font-bold text-primary">Completa tu perfil</h2>
        <p className="mt-2 text-slate-600">Agrega tu CUIT/CUIL/DNI, nombre y domicilio para continuar.</p>

        <form className="mt-8 grid gap-6" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">CUIT / CUIL / DNI</span>
            <input
              value={form.cuit_cuil}
              onChange={(e) => setForm({ ...form, cuit_cuil: e.target.value.replace(/\D/g, '') })}
              className={`mt-2 w-full rounded-2xl border bg-slate-50 px-4 py-3 focus:border-primary focus:outline-none ${cuitCuilError ? 'border-red-400' : 'border-slate-300'}`}
              placeholder="Ingresa tu número"
              inputMode="numeric"
              autoComplete="off"
              required
            />
            {cuitCuilError ? <p className="mt-2 text-sm text-red-600">{cuitCuilError}</p> : null}
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Nombre completo</span>
            <input
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value.replace(/[^\p{L}\s'.-]/gu, '') })}
              className={`mt-2 w-full rounded-2xl border bg-slate-50 px-4 py-3 focus:border-primary focus:outline-none ${nombreError ? 'border-red-400' : 'border-slate-300'}`}
              placeholder="Ej. Juan Pérez"
              autoComplete="name"
              required
            />
            {nombreError ? <p className="mt-2 text-sm text-red-600">{nombreError}</p> : null}
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Domicilio</span>
            <input
              value={form.domicilio}
              onChange={(e) => setForm({ ...form, domicilio: e.target.value })}
              className={`mt-2 w-full rounded-2xl border bg-slate-50 px-4 py-3 focus:border-primary focus:outline-none ${domicilioError ? 'border-red-400' : 'border-slate-300'}`}
              placeholder="Calle 123, Ciudad"
              required
            />
            {domicilioError ? <p className="mt-2 text-sm text-red-600">{domicilioError}</p> : null}
          </label>

          <button
            className="w-full rounded-2xl bg-primary px-5 py-3 text-white transition hover:bg-secondary disabled:cursor-not-allowed disabled:bg-slate-400"
            disabled={!isFormValid}
          >
            Guardar perfil
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;
