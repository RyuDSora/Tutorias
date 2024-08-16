import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { decryptValue, encryptionKey } from './components/hashes.jsx';

//import { io } from 'socket.io-client';


const Success = () => <h1>¡Pago realizado con éxito!</h1>;
const Cancel = () => <h1>Pago cancelado. Inténtalo de nuevo.</h1>;
//componentes
import DashboardComponent from './DashboardComponent';
import AboutUs from './components/AboutUs';
import HelpCenter from './components/HelpCenter';
import LoginComponent from './components/LoginComponent';
import SignUpComponent from './components/SignUpComponent';
import NavBarT from './components/NavBarT.jsx';
import AccountComponent from './AccountComponent';
import Footer from './components/Footer';
import UnAuthorized from './UnAuthorized';
import CancelPage from './CancelPage';
import SuccessPage from './SuccessPage';
import Tutores from './components/Tutores.jsx';
import Cursos from './components/Cursos.jsx';
import DashboardTutor from './components/DashboardTutor.jsx';
import MyCourses from './components/DashboardTutor/MyCourses';
import MyStudents from './components/DashboardTutor/MyStudents';
import Chats from './components/Chats.jsx';
import Articles from './components/DashboardTutor/Articles2';
import Dash from './components/DashboardTutor/Dash.jsx';
import DashboardStudent from './components/DashboardStudent.jsx';
import MyCoursesST from './components/DashboardStudent/MyCoursesST';
import MyTutor from './components/DashboardStudent/MyTutor';
import ArticlesST from './components/DashboardStudent/ArticlesST';
import DashST from './components/DashboardStudent/DashST.jsx';
import DashboardAdmin from './components/DashboardAdmin.jsx';
import SQLQueryForm from './components/SQLQueryForm';
import TableList from './components/TableList';
import SubscriptionPlans from './SubscriptionPlans.jsx';
import SubscriptionForm from './SubscriptionForm';
import withAuth from './hoc/withAuth';
import PasswordReset from './PasswordReset';
import PasswordResetRequest from './PasswordResetRequest.jsx';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userID, setUserID] = useState(0);

  useEffect(() => {
    if (Cookies.get('$3s1.4')) {
      const session = decryptValue(Cookies.get('$3s1.4'), encryptionKey)
      if (session) {
        const storedLoggedIn = localStorage.getItem('token');
        if (storedLoggedIn) {
          setIsLoggedIn(true);
          const id = decryptValue(Cookies.get('#gt156'), encryptionKey);
          setUserID(parseInt(id));
        }
      }
    }
  }, []);


  return (
    <Router>
      <div>
        <NavBarT isLoggedIn={isLoggedIn} />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/help-center" element={<HelpCenter />} />
          <Route path="/login" element={<LoginComponent setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/signup" element={<SignUpComponent setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/reset-password/:token" element={<PasswordReset />} />
          <Route path="/reset-password-request" element={<PasswordResetRequest />} />
          <Route path="/unauthorized" element={<UnAuthorized />} />
          <Route path="/dashboard" element={<DashboardComponent />} />
          <Route path="/cancel" element={<CancelPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/cursos" element={<Cursos />} />
          <Route path="/tutores" element={<Tutores />} />
          <Route path="/suscripciones" element={<SubscriptionPlans />} />
          <Route path="/subscribe/:plan" component={SubscriptionForm} />
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />
          {/* Rutas protegidas */}
          <Route path="/account" element={withAuth(AccountComponent, ['administrador', 'estudiante', 'tutor'])()} />
          <Route path="/dashboardadmin" element={withAuth(DashboardAdmin, ['administrador'])()} >
            <Route path='sql' element={<SQLQueryForm />} />
            <Route path='tables' element={<TableList />} />
            <Route path="chats" element={<Chats userId={userID} />} />
            <Route />
          </Route>
          <Route path="/dashboardstudent" element={withAuth(DashboardStudent, ['estudiante'])()}>
            <Route path="dashst" element={<DashST />} />
            <Route path="my-coursesST" element={<MyCoursesST />} />
            <Route path="my-tutor" element={<MyTutor />} />
            <Route path="chatsST" element={<Chats userId={userID} />} />
            <Route path="articlesST" element={<ArticlesST />} />
          </Route>
          <Route path="/dashboardtutor" element={withAuth(DashboardTutor, ['tutor'])()}>
            <Route path="dash" element={<Dash />} />
            <Route path="my-courses" element={<MyCourses />} />
            <Route path="my-students" element={<MyStudents />} />
            <Route path="chats" element={<Chats userId={userID} />} />
            <Route path="articles" element={<Articles />} />
          </Route>
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
