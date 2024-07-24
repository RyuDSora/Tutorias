import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import DashboardComponent from './DashboardComponent';
import AboutUs from './components/AboutUs';
import HelpCenter from './components/HelpCenter';
import LoginComponent from './LoginComponent';
import SignUpComponent from './SignUpComponent';
import Navbar from './Navbar';
import AccountComponent from './AccountComponent';
import PasswordReset from './PasswordReset';
import Footer from './Footer';
import UnAuthorized from './UnAuthorized';
import CancelPage from './CancelPage';
import SuccessPage from './SuccessPage';
import Table from './components/table.jsx';
import Tutores from './Tutores.jsx';
import Cursos from './Cursos.jsx';
import DashboardTutor from './DashboardTutor.jsx';
import MyCourses from './DashboardTutor/MyCourses';
import MyStudents from './DashboardTutor/MyStudents';
import Chats from './DashboardTutor/Chats';
import Articles from './DashboardTutor/Articles2';
import Dash from './DashboardTutor/Dash.jsx';
import DashboardStudent from './DashboardStudent.jsx';
import MyCoursesST from './DashboardStudent/MyCoursesST';
import MyTutor from './DashboardStudent/MyTutor';
import ChatsST from './DashboardStudent/ChatsST';
import ArticlesST from './DashboardStudent/ArticlesST';
import DashST from './DashboardStudent/DashST.jsx';
import withAuth from './hoc/withAuth';  // Importa el HOC desde la carpeta 'hoc'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedLoggedIn = localStorage.getItem('token');
    if (storedLoggedIn) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <Router>
      <div>
        <Navbar isLoggedIn={isLoggedIn} />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/help-center" element={<HelpCenter />} />
          <Route path="/login" element={<LoginComponent setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/signup" element={<SignUpComponent setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/reset-password" element={<PasswordReset />} />
          <Route path="/unauthorized" element={<UnAuthorized />} />
          <Route path="/dashboard" element={<DashboardComponent />} />
          <Route path="/cancel" element={<CancelPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/cursos" element={<Cursos />} />
          <Route path="/tutores" element={<Tutores />} />

          {/* Rutas protegidas */}
          <Route path="/tables" element={withAuth(Table, ['administrador'])()} />
          <Route path="/account" element={withAuth(AccountComponent, ['administrador', 'estudiante', 'tutor'])()} />
          <Route path="/dashboardstudent" element={withAuth(DashboardStudent, ['estudiante'])()}>
            <Route path="dashst" element={<DashST />} />
            <Route path="my-coursesST" element={<MyCoursesST />} />
            <Route path="my-tutor" element={<MyTutor />} />
            <Route path="chatsST" element={<ChatsST />} />
            <Route path="articlesST" element={<ArticlesST />} />
          </Route>
          <Route path="/dashboardtutor" element={withAuth(DashboardTutor, ['tutor'])()}>
            <Route path="dash" element={<Dash />} />
            <Route path="my-courses" element={<MyCourses />} />
            <Route path="my-students" element={<MyStudents />} />
            <Route path="chats" element={<Chats />} />
            <Route path="articles" element={<Articles />} />
          </Route>
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
