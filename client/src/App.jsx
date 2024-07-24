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
import ProtectedRoute from './ProtectedRoute';
import Footer from './Footer';
import UnAuthorized from './UnAuthorized';
import CancelPage from './CancelPage';
import SuccessPage from './SuccessPage';
import Table from './components/table.jsx';
import Tutores from './Tutores.jsx';
import Cursos from './Cursos.jsx';
import DashboardTutor from './DashboardTutor.jsx';
import MyCourses from './DashboardTutor/MyCourses'; // Componente de subruta
import MyStudents from './DashboardTutor/MyStudents'; // Componente de subruta
import Chats from './DashboardTutor/Chats'; // Componente de subruta
import Articles from './DashboardTutor/Articles2'; // Componente de subruta
import Dash from "./DashboardTutor/Dash.jsx";
import DashboardStudent from './DashboardStudent.jsx';
import MyCoursesST from './DashboardStudent/MyCoursesST'; // Componente de subruta
import MyTutor from './DashboardStudent/MyTutor'; // Componente de subruta
import ChatsST from './DashboardStudent/ChatsST'; // Componente de subruta
import ArticlesST from './DashboardStudent/ArticlesST'; // Componente de subruta
import DashST from "./DashboardStudent/DashST.jsx";

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
          <Route path="/tables" element={<Table />} />
          <Route path="/cursos" element={<Cursos />} />
          <Route path="/tutores" element={<Tutores />} />

          {/* Rutas protegidas */}
          <Route element={<ProtectedRoute allowedRoles={'administrador'} />}>
            {/* Rutas específicas para administradores */}
          </Route>

          <Route element={<ProtectedRoute allowedRoles={'estudiante'} />}>
            <Route path="/dashboardstudent" element={<DashboardStudent />}>
                <Route path="dashst" element={<DashST />} />
                <Route path="my-courses" element={<MyCoursesST />} />
                <Route path="my-tutor" element={<MyTutor />} />
                <Route path="chatsST" element={<ChatsST />} />
                <Route path="articlesST" element={<ArticlesST />} />
              </Route>
            <Route path="/account" element={<AccountComponent />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={'tutor'} />}>
            <Route path="/dashboardtutor" element={<DashboardTutor />}>
              <Route path="dash" element={<Dash />} />
              <Route path="my-courses" element={<MyCourses />} />
              <Route path="my-students" element={<MyStudents />} />
              <Route path="chats" element={<Chats />} />
              <Route path="articles" element={<Articles />} />
            </Route>
            <Route path="/account" element={<AccountComponent />} />
          </Route>
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
