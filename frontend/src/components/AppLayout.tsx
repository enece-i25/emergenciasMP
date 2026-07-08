import { useState } from 'react';
import { NavLink, Outlet, useNavigate, Navigate } from 'react-router-dom';
import Footer from './Footer';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { key: 'dashboard', label: 'Dashboard', path: '/dashboard' },
  { key: 'reportes', label: 'Reportes', path: '/reportes' },
  { key: 'configuracion', label: 'Administración', path: '/configuracion' },
];

function AppLayout() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const role = user?.rol?.toUpperCase();
  const isAdminOrSupervisor = role === 'ADMIN' || role === 'SUPERVISOR';

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="rounded-3xl border border-slate-200 bg-white px-6 py-4 text-slate-700 shadow-sm">Cargando sesión...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const sections: Record<string, { label: string; path: string }[]> = {
    dashboard: [
      { label: 'Resumen', path: '/dashboard' },
      { label: 'Actividad', path: '/dashboard/actividad' },
    ],
    reportes: [
      { label: 'DDJJ', path: '/reportes/ddjj' },
      { label: 'Declaración Jurada', path: '/declaracion-jurada' },
      { label: 'Predios y Actividades', path: '/predios-actividades' },
      { label: 'Eventos', path: '/reportes/eventos' },
      { label: 'Productores', path: '/reportes/productores' },
    ],
    configuracion: [
      { label: 'Perfil', path: '/configuracion/perfil' },
      ...(isAdminOrSupervisor
        ? [
            { label: 'Usuarios', path: '/configuracion/usuarios' },
            { label: 'Perfiles', path: '/configuracion/perfiles' },
          ]
        : []),
    ],
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="fixed left-0 right-0 top-0 z-20 border-b border-transparent bg-gradient-to-r from-primary to-secondary text-white/95 backdrop-blur">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen((value) => !value)}
              aria-label="Alternar menú"
              aria-expanded={sidebarOpen}
              className="md:hidden rounded-lg border border-white/20 px-3 py-2 text-sm font-medium text-white/95 hover:bg-white/10"
            >
              ☰
            </button>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/80">Emergencias MP</p>
              <h1 className="text-lg font-semibold text-white">Panel</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <nav className="hidden gap-2 md:flex">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActiveMenu(item.key)}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition ${activeMenu === item.key ? 'bg-white text-primary' : 'text-white/90 hover:bg-white/10'}`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen((value) => !value)}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 shadow-sm transition hover:bg-white/20"
                >
                  <img src="/png/profile.png" alt="Perfil" className="h-10 w-10 rounded-full" />
                </button>

                {profileMenuOpen ? (
                  <div className="absolute right-0 z-30 mt-2 w-44 overflow-hidden rounded-2xl border border-white/10 bg-white text-slate-900 shadow-xl">
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} border-r border-transparent bg-gradient-to-b from-primary to-secondary text-white transition-all duration-200`}>
          <div className="p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/90">
              {sidebarOpen ? 'Menú' : '⋯'}
            </p>
            <ul className="space-y-2">
              {sections[activeMenu]?.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => `block rounded-xl px-3 py-2 text-sm transition ${isActive ? 'bg-white text-primary' : 'text-white/90 hover:bg-white/10'}`}
                  >
                    {sidebarOpen ? item.label : item.label.charAt(0)}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <main className="min-h-[calc(100vh-4rem)] flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default AppLayout;
