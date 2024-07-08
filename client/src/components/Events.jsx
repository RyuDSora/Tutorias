import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardList } from '@fortawesome/free-solid-svg-icons';

const Events = () => {
    return (
        <div className="bg-indigo-100 shadow-lg p-6 rounded-lg m-4 transform transition duration-500 hover:scale-105 flex items-center justify-center flex-col text-center">
            <div className="mb-4">
                <FontAwesomeIcon icon={faClipboardList} className="text-4xl text-indigo-600" />
            </div>
            <div>
                <h1 className="text-4xl font-extrabold mb-4 text-indigo-800">Eventos</h1>
                <div>
                    <p className="text-lg">Próximo Evento:</p>
                    <p className="text-xl font-bold mb-4">Venta de Verano</p>
                    <p className="text-sm">¡No te pierdas los descuentos especiales del evento!</p>
                </div>
            </div>
        </div>
    );
};

export default Events;