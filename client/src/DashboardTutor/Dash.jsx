import React from 'react';
import TopSellingCourses from '../TopSellingCourses';
import Articles from "../Articles";
import NextLessons from '../NextLessons'
const MyDash = () => {
  return (
    <>
      <div className='my-2'>
        <span className='h3 Principal f_principal'>Tu Resumen</span>
      </div>
      <div className='row my-2 pt-3'>
        <div className='col-sm-8'>
          <div><TopSellingCourses /></div>  
        </div>
        <div className='col-sm-4'>
          <div><NextLessons /></div>
        </div>
      </div>
      <div className='my-2'>
        <span className='h3 Principal f_principal'>Top Artículos</span>
      </div>
      <div className='row'>
        <div className='col'><Articles /></div>
      </div>
    </>
  );
};

export default MyDash;