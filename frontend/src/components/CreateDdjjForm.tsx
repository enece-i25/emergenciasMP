import { useEffect, useState } from 'react';

type CreateDdjjFormProps = {
  onCreated: () => void;
};

type FormState = {
  productorId: string;
  eventoId: string;
  fecha: string;
  estado: string;
};

function CreateDdjjForm({ onCreated }: CreateDdjjFormProps) {
  const [form, setForm] = useState<FormState>({
    productorId: '',
    eventoId: '',
    fecha: '',
    estado: 'PENDIENTE',
  });
  const [eventos, setEventos] = useState<any[]>([]);
  const [productores, setProductores] = useState<any[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadOptions = async () => {
      const [eventosRes, productoresRes] = await Promise.all([
        fetch('/api/eventos', { credentials: 'include' }),
        fetch('/api/productores', { credentials: 'include' }),
      ]);

      setEventos(await eventosRes.json());
      setProductores(await productoresRes.json());
    };

    loadOptions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    const res = await fetch('http://localhost:4001/ddjj', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        productorId: form.productorId,
        eventoId: form.eventoId,
        fecha: form.fecha,
        estado: form.estado,
      }),
    });

    if (res.ok) {
      setForm({ productorId: '', eventoId: '', fecha: '', estado: 'PENDIENTE' });
      setMessage('DDJJ creada correctamente.');
      onCreated();
    } else {
      const data = await res.json().catch(() => ({}));
      setMessage(data.error || 'No se pudo crear la DDJJ.');
    }
  };

  return (
    <section className="mb-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">
      <h2 className="text-xl font-semibold text-primary">Nueva DDJJ</h2>
      <p className="mt-2 text-sm text-slate-600">Completa los datos para registrar una nueva declaración jurada.</p>

      <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Evento</span>
          <select
            value={form.eventoId}
            onChange={(e) => setForm({ ...form, eventoId: e.target.value })}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3"
            required
          >
            <option value="">Seleccioná un evento</option>
            {eventos.map((evento) => (
              <option key={evento.id} value={evento.id}>{evento.nombre}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Productor</span>
          <select
            value={form.productorId}
            onChange={(e) => setForm({ ...form, productorId: e.target.value })}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3"
            required
          >
            <option value="">Seleccioná un productor</option>
            {productores.map((productor) => (
              <option key={productor.id} value={productor.id}>{productor.nombre}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Fecha</span>
          <input
            type="date"
            value={form.fecha}
            onChange={(e) => setForm({ ...form, fecha: e.target.value })}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Estado</span>
          <select
            value={form.estado}
            onChange={(e) => setForm({ ...form, estado: e.target.value })}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3"
            required
          >
            <option value="PENDIENTE">PENDIENTE</option>
            <option value="APROBADA">APROBADA</option>
            <option value="RECHAZADA">RECHAZADA</option>
          </select>
        </label>

        <div className="md:col-span-2">
          <button className="w-full rounded-2xl bg-primary px-5 py-3 text-white transition hover:bg-secondary">
            Crear DDJJ
          </button>
          {message ? <p className="mt-3 text-sm text-slate-600">{message}</p> : null}
        </div>
      </form>
    </section>
  );
}

export default CreateDdjjForm;
