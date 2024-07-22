import React from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom'; // Importar Outlet para las subrutas

const DashboardTutor = () => {
  return (
    <div className="container-fluid m-2">
      <div className="row">
        <div className='col-2 border-end'>
          <Sidebar />
        </div>
        <div className='col-9 px-4'>
          <main className="my-3">
            <Outlet /> {/* Renderizar subrutas aquí */}
          </main>
        </div>
      </div>
    </div>
  );
}

export default DashboardTutor;
