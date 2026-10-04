import { useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import IncidentDetails from './pages/IncidentDetails';
import Login from './pages/Login';
import ReportEmergency from './pages/ReportEmergency';
import { clearAuth, getStoredAuth, storeAuth } from './services/api';

export default function App() {
  const [page, setPage] = useState('home');
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [auth, setAuth] = useState(getStoredAuth);
  const [requestedRole, setRequestedRole] = useState('Control Officer');

  function navigate(target, role) {
    if (role) setRequestedRole(role);
    if (target === 'report' && auth?.user?.role !== 'Citizen') {
      setRequestedRole('Citizen');
      setPage('login');
      return;
    }
    if (
      (target === 'dashboard' || target === 'details')
      && auth?.user?.role !== 'Control Officer'
    ) {
      setRequestedRole('Control Officer');
      setPage('login');
      return;
    }
    setPage(target);
  }

  function handleAuthenticated(nextAuth) {
    storeAuth(nextAuth);
    setAuth(nextAuth);
    setPage(nextAuth.user.role === 'Citizen' ? 'report' : 'dashboard');
  }

  function logout() {
    clearAuth();
    setAuth(null);
    setSelectedIncident(null);
    setRequestedRole('Control Officer');
    setPage('home');
  }

  function openIncident(incident) {
    if (auth?.user?.role !== 'Control Officer') {
      navigate('dashboard');
      return;
    }
    setSelectedIncident(incident);
    setPage('details');
  }

  return (
    <div className="app">
      <Navbar
        page={page}
        navigate={navigate}
        auth={auth}
        onLogout={logout}
      />
      {page === 'home' && <Home setPage={navigate} />}
      {page === 'report' && <ReportEmergency setPage={navigate} />}
      {page === 'dashboard' && <Dashboard openIncident={openIncident} />}
      {page === 'details' && (
        <IncidentDetails incident={selectedIncident} setPage={navigate} />
      )}
      {page === 'login' && (
        <Login
          key={requestedRole}
          requestedRole={requestedRole}
          onAuthenticated={handleAuthenticated}
        />
      )}
      <footer className="footer">
        <span>AI Emergency Response Network</span>
        <span>AI recommendations are decision support; responders make final decisions.</span>
      </footer>
    </div>
  );
}
