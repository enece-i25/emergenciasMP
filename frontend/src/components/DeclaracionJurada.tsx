import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type DeclaracionJuradaState = {
  apellidoNombre: string;
  tipoDocumento: string;
  numeroDocumento: string;
  sexo: string;
  cuitCuil: string;
  pais: string;
  provincia: string;
  departamento: string;
  municipio: string;
  paraje: string;
  seccion: string;
  codigoPostal: string;
  barrio: string;
  calleRuta: string;
  numeroKm: string;
  sectorBloque: string;
  torrePiso: string;
  manzana: string;
  casa: string;
  telefono1: string;
  telefono2: string;
  telefono3: string;
};

const initialState: DeclaracionJuradaState = {
  apellidoNombre: '',
  tipoDocumento: '',
  numeroDocumento: '',
  sexo: '',
  cuitCuil: '',
  pais: 'Argentina',
  provincia: '',
  departamento: '',
  municipio: '',
  paraje: '',
  seccion: '',
  codigoPostal: '',
  barrio: '',
  calleRuta: '',
  numeroKm: '',
  sectorBloque: '',
  torrePiso: '',
  manzana: '',
  casa: '',
  telefono1: '',
  telefono2: '',
  telefono3: '',
};

function DeclaracionJurada() {
  const [form, setForm] = useState<DeclaracionJuradaState>(initialState);
  const { user } = useAuth();
  const [eventos, setEventos] = useState<any[]>([]);
  const [eventoId, setEventoId] = useState('');
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  const handleChange = (field: keyof DeclaracionJuradaState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  useEffect(() => {
    const loadEventos = async () => {
      try {
        const res = await fetch('/api/eventos', { credentials: 'include' });
        if (!res.ok) return;
        const data = await res.json();
        setEventos(data);
      } catch (err) {
        // ignore
      }
    };

    loadEventos();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage('');

    try {
      const body: any = {
        ...form,
        productorId: user?.id || '',
        fecha: new Date().toISOString(),
        estado: 'Pendiente',
      };

      if (eventoId) body.eventoId = eventoId;

      const response = await fetch('http://localhost:4001/ddjj', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData?.error || 'No se pudo guardar la declaración jurada.';
        setMessage(errorMessage);
        setIsSaving(false);
        return;
      }

      const ddjjData = await response.json();
      setForm(initialState);
      navigate(`/predios-actividades?ddjjId=${ddjjData.id}`);
    } catch (error) {
      setMessage('Error de conexión con el backend. Intenta nuevamente.');
      setIsSaving(false);
    }
  };

  return (
    <section className="mx-auto max-w-6xl rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.2em] text-secondary">Declaración Jurada</p>
        <h1 className="mt-2 text-3xl font-semibold text-primary">Emergencia Agropecuaria</h1>
        <p className="mt-2 text-sm text-slate-600">Completa los datos del productor, domicilio y teléfonos para registrar la DDJJ.</p>
      </div>

      <form className="space-y-8" onSubmit={handleSubmit}>
        <fieldset className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <legend className="px-2 text-lg font-semibold text-slate-900">Identificación del productor</legend>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Evento</span>
              <select
                value={eventoId}
                onChange={(e) => setEventoId(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3"
              >
                <option value="">Seleccioná un evento</option>
                {eventos.map((ev) => (
                  <option key={ev.id} value={ev.id}>{ev.nombre}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Apellido y Nombre</span>
              <input
                type="text"
                value={form.apellidoNombre}
                onChange={(e) => handleChange('apellidoNombre', e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Tipo de Documento</span>
              <select
                value={form.tipoDocumento}
                onChange={(e) => handleChange('tipoDocumento', e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3"
                required
              >
                <option value="">Seleccioná</option>
                <option value="DNI">DNI</option>
                <option value="LE">LE</option>
                <option value="LC">LC</option>
                <option value="PASAPORTE">Pasaporte</option>
                <option value="OTRO">Otro</option>
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Número de Documento</span>
              <input
                type="text"
                value={form.numeroDocumento}
                onChange={(e) => handleChange('numeroDocumento', e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Sexo</span>
              <select
                value={form.sexo}
                onChange={(e) => handleChange('sexo', e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3"
                required
              >
                <option value="">Seleccioná</option>
                <option value="MASCULINO">Masculino</option>
                <option value="FEMENINO">Femenino</option>
                <option value="OTRO">Otro</option>
              </select>
            </label>
            <label className="block md:col-span-2">
              <span className="text-sm font-semibold text-slate-700">CUIT/CUIL</span>
              <input
                type="text"
                value={form.cuitCuil}
                onChange={(e) => handleChange('cuitCuil', e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3"
                required
              />
            </label>
          </div>
        </fieldset>

        <fieldset className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <legend className="px-2 text-lg font-semibold text-slate-900">Domicilio</legend>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">País</span>
              <input
                type="text"
                value={form.pais}
                onChange={(e) => handleChange('pais', e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Provincia</span>
              <select
                value={form.provincia}
                onChange={(e) => handleChange('provincia', e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3"
                required
              >
                <option value="">Seleccioná</option>
                <option value="Buenos Aires">Buenos Aires</option>
                <option value="Catamarca">Catamarca</option>
                <option value="Chaco">Chaco</option>
                <option value="Córdoba">Córdoba</option>
                <option value="Santa Fe">Santa Fe</option>
                <option value="Otro">Otro</option>
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Departamento</span>
              <input
                type="text"
                value={form.departamento}
                onChange={(e) => handleChange('departamento', e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Municipio</span>
              <input
                type="text"
                value={form.municipio}
                onChange={(e) => handleChange('municipio', e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Paraje</span>
              <select
                value={form.paraje}
                onChange={(e) => handleChange('paraje', e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3"
              >
                <option value="">Seleccioná</option>
                <option value="Rural">Rural</option>
                <option value="Urbano">Urbano</option>
                <option value="Otro">Otro</option>
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Sección</span>
              <input
                type="text"
                value={form.seccion}
                onChange={(e) => handleChange('seccion', e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Código Postal</span>
              <input
                type="text"
                value={form.codigoPostal}
                onChange={(e) => handleChange('codigoPostal', e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Barrio</span>
              <input
                type="text"
                value={form.barrio}
                onChange={(e) => handleChange('barrio', e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Calle / Ruta</span>
              <input
                type="text"
                value={form.calleRuta}
                onChange={(e) => handleChange('calleRuta', e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Número / Km</span>
              <input
                type="text"
                value={form.numeroKm}
                onChange={(e) => handleChange('numeroKm', e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Sector / Bloque</span>
              <input
                type="text"
                value={form.sectorBloque}
                onChange={(e) => handleChange('sectorBloque', e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Torre / Piso</span>
              <input
                type="text"
                value={form.torrePiso}
                onChange={(e) => handleChange('torrePiso', e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Manzana</span>
              <input
                type="text"
                value={form.manzana}
                onChange={(e) => handleChange('manzana', e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Casa</span>
              <input
                type="text"
                value={form.casa}
                onChange={(e) => handleChange('casa', e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3"
              />
            </label>
          </div>
        </fieldset>

        <fieldset className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <legend className="px-2 text-lg font-semibold text-slate-900">Teléfonos</legend>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Teléfono 1</span>
              <input
                type="tel"
                value={form.telefono1}
                onChange={(e) => handleChange('telefono1', e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Teléfono 2</span>
              <input
                type="tel"
                value={form.telefono2}
                onChange={(e) => handleChange('telefono2', e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Teléfono 3</span>
              <input
                type="tel"
                value={form.telefono3}
                onChange={(e) => handleChange('telefono3', e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3"
              />
            </label>
          </div>
        </fieldset>

        <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex w-full items-center justify-center rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? 'Guardando...' : 'Guardar'}
          </button>
          {message ? <p className="text-sm text-slate-600">{message}</p> : null}
        </div>
      </form>
    </section>
  );
}

export default DeclaracionJurada;
