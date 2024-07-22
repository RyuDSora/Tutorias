import React from 'react';
import Sidebar from './Sidebar';
import TopSellingCourses from './TopSellingCourses';
import NextLessons from './NextLessons';
import Articles from './Articles';

const DashboardTutor = () => {
  return (
    <div className="container m-2">
      <div className="row">
        <div className='col-3 border-end'>
          <Sidebar />
        </div>
        <div className='col-9 ml-sm-auto px-4 '>
          <main className="my-3">
            <div className='my-2'><span className='h3'>Tu Resumen</span></div>
            <div></div>
            <div className='row'>
              <div className='col-8'>
                <div><TopSellingCourses /></div>  
              </div>
              <div className='col-4'>
                <div><NextLessons /></div>
              </div>
            </div>
            <div className='my-2'><span className='h3'>Artìculos</span></div>
            <div className='row'>
              <div className='col'><Articles /></div>
            </div>
        </main>
        </div>
      </div>
    </div>
  );
}

export default DashboardTutor;
