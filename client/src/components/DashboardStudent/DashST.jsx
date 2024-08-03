import React from 'react';
import TopSellingCourses from '../TopSellingCourses';
import Articles from "../Articles";
import NextLessons from '../NextLessons'

const Mytutors = () => {
  return (
    <>
    <div className='my-2'>
      <span className='h3 Principal f_principal'>Tu Resumen</span>
    </div>
    <div></div>
    <div className='row'>
              <div className='col-8'>
                <div><TopSellingCourses /></div>  
              </div>
              <div className='col-4'>
                <div><NextLessons /></div>
              </div>
            </div>
            <div className='my-2'><span className='h3 Principal f_principal'>Artìculos</span></div>
            <div className='row'>
              <div className='col'><Articles /></div>
            </div>
    </>
  );
};

export default Mytutors;
