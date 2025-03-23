import { Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import { About } from './pages/About';
import AdminLogin from './pages/Admin login';
import AdminPage from './pages/AdminPage';
import { Contact } from './pages/Contact';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Sign } from './pages/Sign';
import { UserLogin } from './pages/Userlogin';
import UserPage from './pages/UserPage';
import WorkerLogin from './pages/WorkerLogin';
import WorkerPage from './pages/WorkerPage';

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />}/>
        <Route path="/login" element={<Login />} />
        <Route path="/login/user" element={<UserLogin />} />
        <Route path="/login/admin" element={<AdminLogin />} />
        <Route path="/login/signup" element={<Sign/>} />
        <Route path="/login/user/userpage" element={<UserPage/>} />
        <Route path="/login/worker" element={<WorkerLogin />} />
        <Route path="/login/worker/workerpage" element={<WorkerPage />} />
        <Route path="/admin-dashboard" element={<AdminPage />} />
      </Routes>
    </>
  );
};

export default App;
