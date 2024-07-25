import React from 'react';
import SidebarST from './SidebarST';
import { Outlet } from 'react-router-dom'; // Importar Outlet para las subrutas

const DashboardStundet = () => {
    return (
        <div className="container-fluid">
          <div className="row">
            <div className='col-2 border-end pe-0'>
              <SidebarST />
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

export default DashboardStundet;