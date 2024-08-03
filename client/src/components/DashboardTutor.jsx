import React from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom'; // Importar Outlet para las subrutas

const DashboardTutor = () => {
  return (
    <div className="container-fluid">
      <div className='d-flex'>
        <div className='pe-0 mt-3'>
          <Sidebar />
        </div>
        <div className="container-fluid pe-0">
          <div className=''>
            <main className="my-3">
              <Outlet /> {/* Renderizar subrutas aquí */}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardTutor;
