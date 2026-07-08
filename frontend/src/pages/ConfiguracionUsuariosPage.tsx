import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

type Usuario = {
  id: string;
  email: string;
  rol: string;
  productor?: { nombre?: string };
};

function ConfiguracionUsuariosPage() {
  const { user } = useAuth();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const role = user?.rol?.toUpperCase();
  const isAdminOrSupervisor = role === 'ADMIN' || role === 'SUPERVISOR';

  useEffect(() => {
    const loadUsuarios = async () => {
      try {
        const response = await fetch('/api/usuarios', { credentials: 'include' });
        if (!response.ok) {
          setUsuarios([]);
          return;
        }
        const data = await response.json();
        setUsuarios(data);
      } finally {
        setLoading(false);
      }
    };

    if (isAdminOrSupervisor) {
      loadUsuarios();
    } else {
      setLoading(false);
    }
  }, [isAdminOrSupervisor]);

  const updateRole = async (id: string, roleValue: string) => {
    setMessage('');
    try {
      const response = await fetch(`/api/usuarios/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ rol: roleValue }),
      });
      if (!response.ok) {
        setMessage('No se pudo actualizar el rol.');
        return;
      }
      setUsuarios((current) => current.map((usuario) => (usuario.id === id ? { ...usuario, rol: roleValue } : usuario)));
      setMessage('Rol actualizado correctamente.');
    } catch (error) {
      setMessage('Error de conexión con el servidor.');
    }
  };

  if (!isAdminOrSupervisor) {
    return (
      <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-900">
        No tienes permiso para gestionar usuarios.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
        <p className="text-sm uppercase tracking-[0.2em] text-secondary">Usuarios</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Gestión de usuarios</h1>
        <p className="mt-2 text-sm text-slate-600">Administra los usuarios y sus roles dentro del sistema.</p>
      </header>

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-600">Cargando usuarios...</div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 font-semibold text-slate-700">Email</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Rol</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Productor</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td className="px-4 py-3 text-slate-600">{usuario.email}</td>
                  <td className="px-4 py-3 text-slate-600">{usuario.rol}</td>
                  <td className="px-4 py-3 text-slate-600">{usuario.productor?.nombre || '-'}</td>
                  <td className="px-4 py-3">
                    <select
                      value={usuario.rol}
                      onChange={(e) => updateRole(usuario.id, e.target.value)}
                      className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2"
                    >
                      <option value="PRODUCTOR">Productor</option>
                      <option value="INSPECTOR">Inspector</option>
                      <option value="SUPERVISOR">Supervisor</option>
                      <option value="ADMIN">Administrador</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {message ? <p className="text-sm text-slate-600">{message}</p> : null}
    </div>
  );
}

export default ConfiguracionUsuariosPage;
