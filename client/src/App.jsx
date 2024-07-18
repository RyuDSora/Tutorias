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
import Table from './components/table.jsx'


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedLoggedIn = localStorage.getItem('token');
    if (storedLoggedIn) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div>
        <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/about-us" element={<AboutUs />} />          
          <Route path="/help-center" element={<HelpCenter />} />
          <Route path="/login" element={<LoginComponent setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/signup" element={<SignUpComponent />} />
          <Route path="/reset-password" element={<PasswordReset />} />
          <Route path="/unauthorized" element={<UnAuthorized />} />
          <Route path="/dashboard" element={<DashboardComponent />} />
          <Route path="/account" element={<AccountComponent />} />      
          <Route path="/cancel" element={<CancelPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/tables" element={<Table />} />



          <Route element={<ProtectedRoute allowedRoles={['admin', 'empleado']} />}>
          </Route>
          <Route element={<ProtectedRoute allowedRoles={['user']} />}>
            <Route path="/account" element={<AccountComponent />} />
          </Route>
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
