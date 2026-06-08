import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import ResetPassword from './components/ResetPassword';
import { Route, Routes } from "react-router-dom";
import Meal from './components/Meal';
import LockedPage from './components/LockedPage';
import Welcome from './components/Welcome';
import Home from './components/Home';
import VerifyOTP from './components/VerifyOtp';
import ProfileSetup from './components/ProfileSetup';
import Dashboard from './components/Dashboard';
import UserProfile from './components/UserProfile';
import AdminDashboard from './components/AdminDashboard';

function App() {
  return <>
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/forgot-password" element={<ResetPassword />} />
      <Route path="/meal" element={<Meal />} />
      <Route path="/lockedpage" element={<LockedPage/>} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/profile-setup" element={<ProfileSetup />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/profile" element={<ProfileSetup />} />
      <Route path="/user-profile" element={<UserProfile />} />
    </Routes>
  </>
}

export default App;