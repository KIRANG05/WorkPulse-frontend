import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Home from "./Pages/Home/Home";
import About from "./Pages/About/About";
import Service from "./Pages/Service/Service";
import Contact from "./Pages/Contact/Contact";
import Login from "./Pages/Login/Login";
import Register  from "./Pages/Register/Register";
import Dashboard from "./Pages/Dashboard/Dashboard";
import AddEmployee from "./Pages/AddEmployee/AddEmployee";
import AdminDashboard from "./Pages/AdminDashboard/AdminDashboard";
import HrDashboard from "./Pages/HrDashboard/HrDashboard";
import EmployeeDashboard from "./Pages/EmployeeDashboard/EmployeeDashboard";
import Employees from "./Pages/AdminDashboard/Employees";
import DashboardHome from "./Pages/AdminDashboard/DashboardHome";
import EditEmployee from "./Pages/EditEmployee/EditEmployee";
import Tasks from "./Pages/AdminDashboard/Tasks";
import Reports from "./Pages/AdminDashboard/Reports";
import Profile from "./Pages/AdminDashboard/Settings/Profile";
import RoleManagement from "./Pages/AdminDashboard/Settings/RoleManagement";
import ChangePassword from "./Pages/AdminDashboard/Settings/ChangePassword";
import AdminLeaves from "./Pages/AdminDashboard/AdminLeaves";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Service />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-employee" element={<AddEmployee />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />}>
        <Route index element={<DashboardHome />} /> 
         <Route path="employees" element={<Employees />} />
         <Route path="tasks" element={<Tasks />} />
         <Route path="reports" element={<Reports />} />
         <Route path="settings/profile" element={<Profile />} />
         <Route path="settings/role" element={<RoleManagement />} />
         <Route path="settings/change-password" element={<ChangePassword />} />
         <Route path="/admin-dashboard/leaves" element={<AdminLeaves />} />

         </Route>
         <Route path="employeeUpdateById/:id" element={<EditEmployee />} />
        <Route path="/hr-dashboard" element={<HrDashboard />} />
        <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
         
      </Routes>
    </Router>
  );
}

export default App;
