import React from 'react';
import Sidebar from './Sidebar';
import TopSellingCourses from './TopSellingCourses';
import NextLessons from './NextLessons';
import Articles from './Articles';

const DashboardTutor = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <Sidebar />
        <main className="col-md-9 ml-sm-auto col-lg-10 px-4">
         
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">Your wrap up</h1>
          </div>
          <div className="row">
            <div className="col-md-6">
              <TopSellingCourses />
            </div>
            <div className="col-md-6">
              <NextLessons />
            </div>
          </div>
          <Articles />
        </main>
      </div>
    </div>
  );
}

export default DashboardTutor;
