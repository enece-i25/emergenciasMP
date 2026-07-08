import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import DeclaracionJuradaPage from './pages/DeclaracionJuradaPage';
import PrediosActividadesPage from './pages/PrediosActividadesPage';
import ConfiguracionLayout from './pages/ConfiguracionLayout';
import ConfiguracionPerfilPage from './pages/ConfiguracionPerfilPage';
import ConfiguracionUsuariosPage from './pages/ConfiguracionUsuariosPage';
import ConfiguracionPerfilesPage from './pages/ConfiguracionPerfilesPage';

function App() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<AppLayout />}>
          <Route path="/perfil" element={<ProfilePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/reportes" element={<DashboardPage />} />
          <Route path="/reportes/ddjj" element={<DashboardPage />} />
          <Route path="/reportes/eventos" element={<DashboardPage />} />
          <Route path="/reportes/productores" element={<DashboardPage />} />
          <Route path="/configuracion" element={<ConfiguracionLayout />}>
            <Route index element={<Navigate to="/configuracion/perfil" replace />} />
            <Route path="perfil" element={<ConfiguracionPerfilPage />} />
            <Route path="usuarios" element={<ConfiguracionUsuariosPage />} />
            <Route path="perfiles" element={<ConfiguracionPerfilesPage />} />
          </Route>
          <Route path="/declaracion-jurada" element={<DeclaracionJuradaPage />} />
          <Route path="/predios-actividades" element={<PrediosActividadesPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;
