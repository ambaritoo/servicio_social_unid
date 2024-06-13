import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between">
          <div>
            <h3 className="text-xl font-bold mb-4">Mi Proyecto</h3>
            <p className="text-gray-400">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Enlaces</h3>
            <ul>
              <li className="mb-2">
                <Link href="/" className="text-gray-400 hover:text-white">Inicio</Link>
              </li>
              <li className="mb-2">
                <Link href="/about" className="text-gray-400 hover:text-white">Sobre Nosotros</Link>
              </li>
              <li className="mb-2">
                <Link href="/services" className="text-gray-400 hover:text-white">Servicios</Link>
              </li>
              <li className="mb-2">
                <Link href="/contact" className="text-gray-400 hover:text-white">Contacto</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Síguenos</h3>
            <ul className="flex space-x-4">
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.36 2.64A10 10 0 105 18.36 10 10 0 0018.36 2.64zm-.92 4.83a1.47 1.47 0 00-2.1 0 1.48 1.48 0 000 2.1 1.47 1.47 0 002.1 0 1.48 1.48 0 000-2.1zm-4.4 1.48a5.58 5.58 0 11-5.58 5.58 5.59 5.59 0 015.58-5.58z"></path>
                  </svg>
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.25 4.73a5.6 5.6 0 01-1.61.44A2.81 2.81 0 0018.73 3a5.61 5.61 0 01-1.78.68 2.8 2.8 0 00-4.77 2.56 7.94 7.94 0 01-5.77-2.93A2.8 2.8 0 004.1 8.1a2.78 2.78 0 01-1.27-.35v.04a2.8 2.8 0 002.24 2.74 2.8 2.8 0 01-1.26.05 2.8 2.8 0 002.61 1.94A5.6 5.6 0 013 16.57a7.88 7.88 0 004.27 1.25c5.12 0 7.93-4.24 7.93-7.93v-.36a5.66 5.66 0 001.39-1.45 5.57 5.57 0 01-1.59.44 2.8 2.8 0 001.23-1.54z"></path>
                  </svg>
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.04a10 10 0 00-10 10c0 4.42 2.87 8.16 6.84 9.49.5.09.66-.22.66-.48v-1.7c-2.78.6-3.36-1.34-3.36-1.34a2.65 2.65 0 00-1.1-1.45c-.9-.61.06-.6.06-.6a2.1 2.1 0 011.53 1.03 2.1 2.1 0 002.87.82 2.1 2.1 0 01.62-1.32c-2.22-.25-4.55-1.12-4.55-4.98 0-1.1.39-2 1.03-2.7a3.6 3.6 0 01.1-2.66s.84-.27 2.75 1.02a9.55 9.55 0 015 0c1.91-1.29 2.75-1.02 2.75-1.02a3.6 3.6 0 01.1 2.66 3.8 3.8 0 011.03 2.7c0 3.87-2.34 4.72-4.57 4.97a2.37 2.37 0 01.67 1.83v2.72c0 .27.16.58.67.48a10 10 0 00-4.66-19.5z"></path>
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-4">
          <p className="text-center text-gray-400">
            &copy; {new Date().getFullYear()} Mi Proyecto. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
