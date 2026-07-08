import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

type Usuario = {
  id: string;
  email: string;
  rol: string;
};

const perfiles = [
  { label: 'Productor', value: 'PRODUCTOR' },
  { label: 'Inspector', value: 'INSPECTOR' },
  { label: 'Supervisor', value: 'SUPERVISOR' },
  { label: 'Administrador', value: 'ADMIN' },
];

function ConfiguracionPerfilesPage() {
  const { user } = useAuth();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedRole, setSelectedRole] = useState('PRODUCTOR');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const role = user?.rol?.toUpperCase();
  const isAdminOrSupervisor = role === 'ADMIN' || role === 'SUPERVISOR';

  useEffect(() => {
    const loadUsuarios = async () => {
      try {
        const response = await fetch('/api/usuarios', { credentials: 'include' });
        if (!response.ok) {
          return;
        }
        const data = await response.json();
        setUsuarios(data);
        if (data.length > 0) {
          setSelectedUser(data[0].id);
        }
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

  const assignProfile = async () => {
    if (!selectedUser) {
      return;
    }

    setMessage('');
    try {
      const response = await fetch(`/api/usuarios/${selectedUser}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ rol: selectedRole }),
      });
      if (!response.ok) {
        setMessage('No se pudo asignar el perfil.');
        return;
      }
      setUsuarios((current) =>
        current.map((usuario) =>
          usuario.id === selectedUser ? { ...usuario, rol: selectedRole } : usuario,
        ),
      );
      setMessage('Perfil asignado correctamente.');
    } catch (error) {
      setMessage('Error de conexión con el servidor.');
    }
  };

  if (!isAdminOrSupervisor) {
    return (
      <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-900">
        No tienes permiso para gestionar perfiles.
      </div>
    );
  }

  const counts = perfiles.map((perfil) => ({
    ...perfil,
    total: usuarios.filter((usuario) => usuario.rol === perfil.value).length,
  }));

  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
        <p className="text-sm uppercase tracking-[0.2em] text-secondary">Perfiles</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Gestión de perfiles</h1>
        <p className="mt-2 text-sm text-slate-600">Revisa cuántos usuarios existen por perfil y asigna roles según sea necesario.</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        {counts.map((perfil) => (
          <div key={perfil.value} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-700">{perfil.label}</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">{perfil.total}</p>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-3">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Usuario</span>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3"
            >
              {usuarios.map((usuario) => (
                <option key={usuario.id} value={usuario.id}>
                  {usuario.email}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Perfil</span>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3"
            >
              {perfiles.map((perfil) => (
                <option key={perfil.value} value={perfil.value}>
                  {perfil.label}
                </option>
              ))}
            </select>
          </label>

          <div className="flex items-end">
            <button
              type="button"
              onClick={assignProfile}
              className="inline-flex w-full items-center justify-center rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-secondary"
            >
              Asignar perfil
            </button>
          </div>
        </div>

        {message ? <p className="mt-4 text-sm text-slate-600">{message}</p> : null}
      </div>
    </div>
  );
}

export default ConfiguracionPerfilesPage;
