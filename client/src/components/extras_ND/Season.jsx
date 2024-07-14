import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faBriefcase, faFemale, faFlag, faUtensils, faTree } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const celebrations = [
    { name: "Día de San Valentín", icon: faHeart },
    { name: "Día del Padre", icon: faBriefcase },
    { name: "Día de la Madre", icon: faFemale },
    { name: "Fiestas Patrias", icon: faFlag },
    { name: "Día de Acción de Gracias", icon: faUtensils },
    { name: "Navidad", icon: faTree }
];

const Season = () => {
    const [currentCelebration, setCurrentCelebration] = useState(0);

    const handleNextCelebration = () => {
        setCurrentCelebration(currentCelebration === celebrations.length - 1 ? 0 : currentCelebration + 1);
    };

    const { name, icon } = celebrations[currentCelebration];

    return (
        <div className="bg-gradient-to-br from-yellow-400 to-pink-400 h-full flex flex-col items-center justify-center p-10">
            <h1 className="text-4xl font-bold text-white mb-4">Celebraciones</h1>
            <div className="flex items-center space-x-4">
                <FontAwesomeIcon icon={icon} className="text-red-600 text-4xl" />
                <p className="text-xl text-white">Próxima Celebración: {name}</p>
            </div>
            <Link to="/product-categories" className="text-lg text-white mt-4 hover:underline cursor-pointer">¡Descubre regalos y sorpresas especiales!</Link>
            <button className="mt-6 bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-md shadow-md" onClick={handleNextCelebration}>Siguiente Celebración</button>
        </div>
    );
};

export default Season;