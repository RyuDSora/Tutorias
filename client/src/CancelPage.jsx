import { Link } from 'react-router-dom';

const CancelPage = () => {
  return (
    <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold" style={{ color: '#336A41', fontFamily: 'Clear Sans Light, sans-serif' }}>
          Su Suscripcion a sido cancelada
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-3xl" style={{ color: '#336A41', fontFamily: 'Clear Sans Light, sans-serif' }}>
          El proceso de Suscripcion ha sido cancelado. Puedes intentarlo de nuevo cuando quieras.
        </h1>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            to="/"
            className="rounded-md px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ backgroundColor: '#336A41', fontFamily: 'Clear Sans Light, sans-serif' }}
          >
            Ir al inicio
          </Link>
        </div>
      </div>
    </main>
  );
};

export default CancelPage;
