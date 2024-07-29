import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { decryptValue,encryptionKey } from './components/hashes.jsx';

//import { io } from 'socket.io-client';


//componentes
import DashboardComponent from './DashboardComponent';
import AboutUs from './components/AboutUs';
import HelpCenter from './components/HelpCenter';
import LoginComponent from './LoginComponent';
import SignUpComponent from './SignUpComponent';
import NavBarT from './NavBarT.jsx';
import AccountComponent from './AccountComponent';
import PasswordReset from './PasswordReset';
import Footer from './Footer';
import UnAuthorized from './UnAuthorized';
import CancelPage from './CancelPage';
import SuccessPage from './SuccessPage';
import Tutores from './Tutores.jsx';
import Cursos from './Cursos.jsx';
import DashboardTutor from './DashboardTutor.jsx';
import MyCourses from './DashboardTutor/MyCourses';
import MyStudents from './DashboardTutor/MyStudents';
import Chats from './components/Chats.jsx';
import Articles from './DashboardTutor/Articles2';
import Dash from './DashboardTutor/Dash.jsx';
import DashboardStudent from './DashboardStudent.jsx';
import MyCoursesST from './DashboardStudent/MyCoursesST';
import MyTutor from './DashboardStudent/MyTutor';
import ArticlesST from './DashboardStudent/ArticlesST';
import DashST from './DashboardStudent/DashST.jsx';
import DashboardAdmin from './DashboardAdmin.jsx';
import SQLQueryForm from './components/SQLQueryForm';
import TableList from './components/TableList';
import SubscriptionPlans from './SubscriptionPlans.jsx';
import withAuth from './hoc/withAuth';
/*
const socket = io('https://tutorias-five.vercel.app', {
  transports: ['websocket'],
  withCredentials: true,
});

socket.on('connect', () => {
  console.log('Connected to socket server:', socket.id);
});

socket.on('disconnect', () => {
  console.log('Disconnected from socket server');
});*/

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userID, setUserID] = useState(0);

  useEffect(() => {
    const session = decryptValue(Cookies.get('$3s1.4'),encryptionKey)
    if (session) {
      const storedLoggedIn = localStorage.getItem('token');
      if (storedLoggedIn) {
        setIsLoggedIn(true);
        const id = decryptValue(Cookies.get('#gt156'),encryptionKey);
        setUserID(parseInt(id));
      }
    }
  }, []);

 /*useEffect(() => {
    if (userID) {
      // Emitir el evento de conexión del usuario
      socket.emit('user_connected', userID);

      // Desconectar el socket al desmontar el componente
      return () => {
        socket.emit('user_disconnected', userID);
        socket.disconnect();
      };
    }
  }, [userID]);
*/
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
          <Route path="/reset-password" element={<PasswordReset />} />
          <Route path="/unauthorized" element={<UnAuthorized />} />
          <Route path="/dashboard" element={<DashboardComponent />} />
          <Route path="/cancel" element={<CancelPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/cursos" element={<Cursos />} />
          <Route path="/tutores" element={<Tutores />} />
          <Route path="/suscripciones" element={<SubscriptionPlans />} />

          {/* Rutas protegidas */}
          <Route path="/account" element={withAuth(AccountComponent, ['administrador', 'estudiante', 'tutor'])()} />
          <Route path="/dashboardadmin" element={withAuth(DashboardAdmin, ['administrador'])()} >
            <Route path='sql' element={<SQLQueryForm />} />
            <Route path='tables' element={<TableList />} />
            <Route path="chats" element={<Chats userId={userID} />} />
            <Route/>
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
