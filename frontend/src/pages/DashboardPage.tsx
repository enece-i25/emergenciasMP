import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import CreateDdjjForm from '../components/CreateDdjjForm';

function DashboardPage() {
  const [eventos, setEventos] = useState<any[]>([]);
  const [productores, setProductores] = useState<any[]>([]);
  const [reportes, setReportes] = useState<any[]>([]);
  const [filters, setFilters] = useState({ evento: '', productor: '' });

  const loadDashboardData = async () => {
    const [eventosRes, productoresRes, reportesRes] = await Promise.all([
      fetch('/api/eventos', { credentials: 'include' }),
      fetch('/api/productores', { credentials: 'include' }),
      fetch('/api/reportes/ddjj', { credentials: 'include' }),
    ]);

    const [nextEventos, nextProductores, nextReportes] = await Promise.all([
      eventosRes.json(),
      productoresRes.json(),
      reportesRes.json(),
    ]);

    setEventos(nextEventos);
    setProductores(nextProductores);
    setReportes(nextReportes);
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const filteredReportes = reportes.filter((item) => {
    const eventoMatch = !filters.evento || item.evento?.id === filters.evento;
    const productorMatch = !filters.productor || item.productor?.id === filters.productor;
    return eventoMatch && productorMatch;
  });

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredReportes.map((row) => ({
      id: row.id,
      evento: row.evento?.nombre,
      productor: row.productor?.nombre,
      fecha_presentacion: row.fecha_presentacion,
      estado: row.estado,
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'DDJJ');
    XLSX.writeFile(workbook, 'ddjj-report.xlsx');
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto w-full max-w-6xl rounded-3xl bg-white p-8 shadow-xl">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-secondary">Panel de control</p>
            <h1 className="text-4xl font-bold text-primary">Reporte de DDJJ</h1>
          </div>
          <button onClick={downloadExcel} className="rounded-2xl bg-primary px-6 py-3 text-white transition hover:bg-secondary">
            Exportar a Excel
          </button>
        </header>

        <CreateDdjjForm onCreated={loadDashboardData} />

        <section className="mb-8 grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Evento</span>
            <select
              value={filters.evento}
              onChange={(e) => setFilters({ ...filters, evento: e.target.value })}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3"
            >
              <option value="">Todos</option>
              {eventos.map((evento) => (
                <option key={evento.id} value={evento.id}>{evento.nombre}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Productor</span>
            <select
              value={filters.productor}
              onChange={(e) => setFilters({ ...filters, productor: e.target.value })}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3"
            >
              <option value="">Todos</option>
              {productores.map((productor) => (
                <option key={productor.id} value={productor.id}>{productor.nombre}</option>
              ))}
            </select>
          </label>
        </section>

        <div className="overflow-x-auto rounded-3xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700">ID</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Evento</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Productor</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Fecha</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredReportes.map((row) => (
                <tr key={row.id}>
                  <td className="px-6 py-4 text-sm text-slate-600">{row.id}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{row.evento?.nombre}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{row.productor?.nombre}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{new Date(row.fecha_presentacion).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{row.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
