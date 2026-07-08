import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ConfiguracionLayout() {
  const { user, loading } = useAuth();
  const role = user?.rol?.toUpperCase();
  const isProductor = role === 'PRODUCTOR';

  const items = [
    ...(isProductor ? [] : [
      { label: 'Usuarios', path: '/configuracion/usuarios' },
      { label: 'Perfiles', path: '/configuracion/perfiles' },
    ]),
    { label: 'Perfil', path: '/configuracion/perfil' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 px-4 py-10">
        <div className="mx-auto max-w-6xl rounded-3xl bg-white p-8 shadow-xl">
          <p className="text-center text-slate-600">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-100 px-4 py-10">
        <div className="mx-auto max-w-6xl rounded-3xl bg-white p-8 shadow-xl">
          <p className="text-center text-slate-600">Debe iniciar sesión para acceder a configuración.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-secondary">Configuración</p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-900">Ajustes</h2>
          <p className="mt-2 text-sm text-slate-600">Gestiona usuarios, perfiles y tus datos personales según tu rol.</p>

          <nav className="mt-8 space-y-2">
            {items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `block rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    isActive ? 'bg-primary text-white' : 'text-slate-700 hover:bg-slate-50'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-10 rounded-3xl bg-slate-50 p-4 text-sm text-slate-600">
            <p className="font-semibold text-slate-800">Rol actual</p>
            <p className="mt-2">{role || 'Desconocido'}</p>
          </div>
        </aside>

        <main className="rounded-3xl bg-white p-6 shadow-sm">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default ConfiguracionLayout;
