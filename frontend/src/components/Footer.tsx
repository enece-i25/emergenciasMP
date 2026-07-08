import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800 bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 text-sm md:grid-cols-3">
          <div className="flex flex-wrap items-center justify-center gap-4 md:justify-start">
            <Link to="/privacy" className="transition hover:text-white">
              Privacidad
            </Link>
            <Link to="/terms" className="transition hover:text-white">
              Términos
            </Link>
          </div>

          <div className="text-center">
            <p className="mb-1">© {currentYear} Ministerio de Producción de Corrientes</p>
            <p className="mb-3 text-xs text-slate-400">Todos los derechos reservados</p>
            <p className="mb-1 text-slate-400">
              <span className="font-semibold text-white">Área de Sistemas</span>
            </p>
            <p className="mb-1 text-slate-400">
              Desarrollo técnico{' '}
              <a
                href="https://www.linkedin.com/in/hernanalegre/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-white transition hover:text-blue-400"
              >
                Hernán Alegre
              </a>{' '}
              {' & '}{' '}
              <a
                href="https://www.linkedin.com/in/c-ivan-nunez/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-white transition hover:text-blue-400"
              >
                Iván Nuñez
              </a>
            </p>
            <p className="text-slate-400">
              Dirección del proyecto{' '}
              <a
                href="https://www.linkedin.com/in/ester-kroslak/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-white transition hover:text-blue-400"
              >
                Lic. Ester Kroslak
              </a>
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 md:justify-end">
            <a href="https://www.facebook.com/ProduccionCorrientes" target="_blank" rel="noreferrer" className="transition hover:opacity-80">
              <img src="/png/fblogo.png" alt="Facebook" className="h-6 w-6" />
            </a>
            <a href="https://x.com/mp_ctes" target="_blank" rel="noreferrer" className="transition hover:opacity-80">
              <img src="/png/xlogo.png" alt="Twitter" className="h-6 w-6" />
            </a>
            <a href="https://www.instagram.com/ministerio_produccion" target="_blank" rel="noreferrer" className="transition hover:opacity-80">
              <img src="/png/iglogo.png" alt="Instagram" className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
