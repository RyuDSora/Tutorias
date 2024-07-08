import React from 'react';
import { HiOutlineInformationCircle } from 'react-icons/hi';

const HelpCenter = () => {
    return (
        <div className="bg-green-100 p-6 rounded-lg m-4 shadow-md transform transition duration-500 hover:scale-105 text-center">
            <div className="flex flex-col items-center justify-center mb-4">
                <HiOutlineInformationCircle className="text-5xl text-green-600" />
                <h1 className="text-3xl font-extrabold text-green-800">Centro de Ayuda</h1>
            </div>
            <p className="text-lg text-green-600 mb-2">Contáctanos para cualquier asistencia o consulta</p>
            <p className="text-lg text-green-600 mb-2">Email: asitencia_pag@gmail.com</p>
            <p className="text-lg text-green-600">Teléfono: +504 9990-9090</p>
        </div>
    );
};

export default HelpCenter;