import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

type PredioRow = {
  id: string;
  adrema: string;
  tenencia: string;
  departamento: string;
  municipio: string;
  actividad: string;
  tipo: string;
  renspa: string;
  superficie: string;
  gps: string;
};

const defaultRow: Omit<PredioRow, 'id'> = {
  adrema: '',
  tenencia: 'Propietario',
  departamento: '',
  municipio: '',
  actividad: 'Agricultura',
  tipo: '',
  renspa: '',
  superficie: '',
  gps: '',
};

function PrediosActividades() {
  const [searchParams] = useSearchParams();
  const ddjjId = searchParams.get('ddjjId') || '';
  const navigate = useNavigate();
  const [rows, setRows] = useState<PredioRow[]>([
    { id: 'row-0', ...defaultRow },
  ]);
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const updateRow = (id: string, field: keyof Omit<PredioRow, 'id'>, value: string) => {
    setRows((current) =>
      current.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    );
  };

  const addRow = () => {
    setRows((current) => [
      ...current,
      { id: `row-${current.length}`, ...defaultRow },
    ]);
  };

  const removeRow = (id: string) => {
    setRows((current) => (current.length > 1 ? current.filter((row) => row.id !== id) : current));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');

    if (!ddjjId) {
      setMessage('No se encontró el ID de DDJJ. Guarda primero la declaración jurada.');
      return;
    }

    setIsSaving(true);

    const payloads = rows.map((row) => ({
      id_ddjj: ddjjId,
      adrema: row.adrema,
      tipo_tenencia: row.tenencia,
      departamento: row.departamento,
      municipio: row.municipio,
      paraje: '',
      gps_poligono: row.gps,
      actividades: {
        create: [
          {
            tipo_actividad: row.actividad,
            subactividad: row.tipo,
            renspa: row.renspa,
            cantidad: Number(row.superficie || 0),
            unidad_medida: 'ha',
          },
        ],
      },
    }));

    try {
      const responses = await Promise.all(
        payloads.map((payload) =>
          fetch('http://localhost:4001/predios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(payload),
          }),
        ),
      );

      const failed = responses.find((res) => !res.ok);
      if (failed) {
        const errorData = await failed.json().catch(() => ({}));
        setMessage(errorData?.error || 'No se pudo guardar el predio.');
        setIsSaving(false);
        return;
      }

      navigate('/dashboard');
    } catch (error) {
      setMessage('Error de conexión con el backend. Intenta nuevamente.');
      setIsSaving(false);
    }
  };

  return (
    <section className="mx-auto max-w-7xl rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.2em] text-secondary">Predios y actividades</p>
        <h1 className="mt-2 text-3xl font-semibold text-primary">Registro de predios</h1>
        <p className="mt-2 text-sm text-slate-600">
          Agrega los predios asociados a la DDJJ. Puedes cargar varias filas de forma dinámica.
        </p>
      </div>

      {!ddjjId ? (
        <div className="rounded-3xl border border-amber-300 bg-amber-50 p-6 text-amber-800">
          No se encontró el identificador de la DDJJ. Guarda primero la declaración jurada y vuelve a esta página.
        </div>
      ) : (
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="overflow-x-auto rounded-3xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-3 py-3 font-semibold text-slate-700">Adrema</th>
                  <th className="px-3 py-3 font-semibold text-slate-700">Tenencia</th>
                  <th className="px-3 py-3 font-semibold text-slate-700">Departamento</th>
                  <th className="px-3 py-3 font-semibold text-slate-700">Municipio</th>
                  <th className="px-3 py-3 font-semibold text-slate-700">Actividad</th>
                  <th className="px-3 py-3 font-semibold text-slate-700">Tipo</th>
                  <th className="px-3 py-3 font-semibold text-slate-700">RENSPA</th>
                  <th className="px-3 py-3 font-semibold text-slate-700">Hectáreas</th>
                  <th className="px-3 py-3 font-semibold text-slate-700">GPS polígono</th>
                  <th className="px-3 py-3 font-semibold text-slate-700">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {rows.map((row, index) => (
                  <tr key={row.id} className="align-top">
                    <td className="px-3 py-3">
                      <input
                        type="text"
                        value={row.adrema}
                        onChange={(e) => updateRow(row.id, 'adrema', e.target.value)}
                        className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2"
                        required
                      />
                    </td>
                    <td className="px-3 py-3">
                      <select
                        value={row.tenencia}
                        onChange={(e) => updateRow(row.id, 'tenencia', e.target.value)}
                        className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2"
                      >
                        <option>Propietario</option>
                        <option>Arrendatario</option>
                        <option>Comodato</option>
                        <option>Otro</option>
                      </select>
                    </td>
                    <td className="px-3 py-3">
                      <select
                        value={row.departamento}
                        onChange={(e) => updateRow(row.id, 'departamento', e.target.value)}
                        className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2"
                        required
                      >
                        <option value="">Seleccioná</option>
                        <option>Departamento 1</option>
                        <option>Departamento 2</option>
                        <option>Departamento 3</option>
                        <option>Otro</option>
                      </select>
                    </td>
                    <td className="px-3 py-3">
                      <select
                        value={row.municipio}
                        onChange={(e) => updateRow(row.id, 'municipio', e.target.value)}
                        className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2"
                        required
                      >
                        <option value="">Seleccioná</option>
                        <option>Municipio 1</option>
                        <option>Municipio 2</option>
                        <option>Municipio 3</option>
                        <option>Otro</option>
                      </select>
                    </td>
                    <td className="px-3 py-3">
                      <select
                        value={row.actividad}
                        onChange={(e) => updateRow(row.id, 'actividad', e.target.value)}
                        className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2"
                      >
                        <option>Agricultura</option>
                        <option>Ganadería</option>
                        <option>Forestal</option>
                        <option>Bajo Cobertura</option>
                        <option>Apicultura</option>
                        <option>Otros</option>
                      </select>
                    </td>
                    <td className="px-3 py-3">
                      <input
                        type="text"
                        value={row.tipo}
                        onChange={(e) => updateRow(row.id, 'tipo', e.target.value)}
                        className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2"
                      />
                    </td>
                    <td className="px-3 py-3">
                      <input
                        type="text"
                        value={row.renspa}
                        onChange={(e) => updateRow(row.id, 'renspa', e.target.value)}
                        className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2"
                      />
                    </td>
                    <td className="px-3 py-3">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={row.superficie}
                        onChange={(e) => updateRow(row.id, 'superficie', e.target.value)}
                        className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2"
                      />
                    </td>
                    <td className="px-3 py-3">
                      <input
                        type="text"
                        value={row.gps}
                        onChange={(e) => updateRow(row.id, 'gps', e.target.value)}
                        className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2"
                      />
                    </td>
                    <td className="px-3 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => removeRow(row.id)}
                        className="rounded-2xl bg-red-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={addRow}
              className="inline-flex items-center justify-center rounded-2xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-200"
            >
              Agregar actividad
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center justify-center rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>

          {message ? <p className="text-sm text-slate-600">{message}</p> : null}
        </form>
      )}
    </section>
  );
}

export default PrediosActividades;
