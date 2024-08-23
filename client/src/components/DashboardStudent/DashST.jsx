
import TopSellingCourses from '../TopSellingCoursesST';
import Articles from "../Articles";
import NextLessons from '../NextLessonsST';

const Mytutors = () => {
  return (
    <>
      <div className='my-2'>
        <span className='h3 Principal f_principal'>Tu Resumen</span>
      </div>

      <div className='row'>
        <div className='col-lg-8 col-md-12 mb-3'>
          <div><TopSellingCourses /></div>  
        </div>
        <div className='col-lg-4 col-md-12 mb-3'>
          <div><NextLessons /></div>
        </div>
      </div>

      <div className='my-2'>
        <span className='h3 Principal f_principal'>Artículos</span>
      </div>

      <div className='row'>
        <div className='col-12'>
          <Articles />
        </div>
      </div>
    </>
  );
};

export default Mytutors;
