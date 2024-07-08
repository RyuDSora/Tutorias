import { Bars3Icon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'; // Importa el componente Link de React Router


const items = [
    {
        title: 'Registrar Producto',
        description: '',
        icon: Bars3Icon,
        background: 'bg-pink-500',
        route: '/form-products'
    },
    {
        title: 'Ver Productos',
        description: '',
        icon: Bars3Icon,
        background: 'bg-yellow-500',
        route: '/products-list'
    },
    {
        title: 'Proveedores',
        description: '',
        icon: Bars3Icon,
        background: 'bg-green-500',
        route: '/providers'
    },
    {
        title: 'Ver Resumen de Ventas',
        description: '',
        icon: Bars3Icon,
        background: 'bg-blue-500',
        route: '/ProductSales'
    },
    {
        title: 'Registrar Empleado',
        description: '',
        icon: Bars3Icon,
        background: 'bg-indigo-500',
        route: '/register/empleado'
    },
    {
        title: 'Ordenes de Compra',
        description: '',
        icon: Bars3Icon,
        background: 'bg-purple-500',
        route: '/orders'
    },

]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function ManagementPanel() {
    return (
        <div className='p-12'>
            <h2 className="text-base font-semibold leading-6 text-gray-900">Panel de Administración</h2>
            <p className="mt-1 text-sm text-gray-500"></p>
            <ul role="list" className="mt-6 grid grid-cols-1 gap-6 border-b border-t border-gray-200 py-6 sm:grid-cols-2">
                {items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flow-root">
                        <div className="relative -m-2 flex items-center space-x-4 rounded-xl p-2 focus-within:ring-2 focus-within:ring-indigo-500 hover:bg-gray-50">
                            <Link to={item.route}>
                                <div
                                    className={classNames(
                                        item.background,
                                        'flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg'
                                    )}
                                >
                                    <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                                </div>
                                <div className="text-center"> {/* Agregar clase text-center para centrar el botón */}
                                    <h3 className="text-sm font-medium text-gray-900">
                                        <span className="absolute inset-0" aria-hidden="true" />
                                        <span>{item.title}</span>
                                        <span aria-hidden="true"> &rarr;</span>
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                                </div>
                            </Link>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}