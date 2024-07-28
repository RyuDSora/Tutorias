import React from 'react';
import SidebarST from './SidebarST';
import { Outlet } from 'react-router-dom'; // Importar Outlet para las subrutas

const DashboardStundet = () => {
  return (
    <div className="container-fluid">
      <div className='d-flex'>
        <div className='border-end pe-0'>
          <SidebarST />
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

export default DashboardStundet;