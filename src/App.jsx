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
import AdminAttendance from "./Pages/AdminDashboard/AdminAttendance";
import NotificationPage from "./Pages/AdminDashboard/NotificationPage";
import HrDashboardHome from "./Pages/HrDashboard/HrDashboardHome";
import HrReportees from "./Pages/HrDashboard/HrReportees";
import HrLeaves from "./Pages/HrDashboard/HrLeaves";
import HrTasks from "./Pages/HrDashboard/HrTasks";
import HrAttendance from "./Pages/HrDashboard/HrAttendance";
import HrNotification from "./Pages/HrDashboard/HrNotification";
import ApplyLeave from "./Pages/HrDashboard/Leave/ApplyLeave";
import LeaveRequests from "./Pages/HrDashboard/Leave/LeaveRequests";
import LeaveSummary from "./Pages/HrDashboard/Leave/LeaveSummary";
import HrChangePassword from "./Pages/HrDashboard/HrChangePassword";
import HrAddTask from "./Pages/HrDashboard/Task/HrAddTask";
import HrTaskDetails from "./Pages/HrDashboard/Task/HrTaskDetails";
import HrUpdateTask from "./Pages/HrDashboard/Task/HrUpdateTask";
import EmployeeDashboardHome from "./Pages/EmployeeDashboard/EmployeeDashboardHome";
import EmployeeTodo from "./Pages/EmployeeDashboard/EmployeeTodo";
import EmployeeAttendance from "./Pages/EmployeeDashboard/EmployeeAttendance";
import EmployeeChangePassword from "./Pages/EmployeeDashboard/EmployeeChangePassword";
import EmployeeTaskDetails from "./Pages/EmployeeDashboard/Task/EmployeeTaskDetails";
import EmployeeUpdateTask from "./Pages/EmployeeDashboard/Task/EmployeeUpdateTask";
import EmployeeLeaveSummary from "./Pages/EmployeeDashboard/Leave/EmployeeLeaveSummary";
import EmployeeApplyLeave from "./Pages/EmployeeDashboard/Leave/EmployeeApplyLeave";
import EmployeeNotification from "./Pages/EmployeeDashboard/EmployeeNotification";
import HrProfile from "./Pages/HrDashboard/HrProfile";
import EmployeeProfile from "./Pages/EmployeeDashboard/EmployeeProfile";
import HrEditEmployee from "./Pages/HrEditEmployee/HrEditEmployee";
import EmployeeEditEmployee from "./Pages/EmployeeEditEmployee/EmployeeEditEmployee";

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
        <Route path="/admin-dashboard/attendence" element={<AdminAttendance />} />
        <Route path="/admin-dashboard/notification" element={<NotificationPage />} />
         </Route>
         <Route path="employeeUpdateById/:id" element={<EditEmployee />} />
        <Route path="/hr-dashboard" element={<HrDashboard />} />
        <Route path="/employee-dashboard" element={<EmployeeDashboard />} />

         <Route path="/hr-dashboard" element={<HrDashboard />}>
          <Route index element={<HrDashboardHome />} />         // dashboard overview
          <Route path="reportees" element={<HrReportees />} />  // view employees
          {/* <Route path="leaves" element={<HrLeaves />} />        // approve/reject leave */}
          <Route path="leaves/apply" element={<ApplyLeave />} /> 
          <Route path="leaves/requests" element={<LeaveRequests />} /> 
          <Route path="leaves/summary" element={<LeaveSummary />} /> 
          <Route path="tasks/add" element={<HrAddTask />} />          // assign task
          <Route path="tasks/details" element={<HrTaskDetails />} />
          <Route path="attendance" element={<HrAttendance />} /> // attendance
          <Route path="settings/profile" element={<HrProfile />} />
          <Route path="settings/change-password" element={<HrChangePassword />} />
          <Route path="notification" element={<HrNotification />} /> // notifications
          <Route path="update-task/:id" element={<HrUpdateTask />} />
        </Route>
        <Route path="hremployeeUpdateById/:id" element={<HrEditEmployee />} />


        <Route path="/employee-dashboard" element={<EmployeeDashboard />}>
          <Route index element={<EmployeeDashboardHome />} />         // dashboard overview
          <Route path="todo" element={<EmployeeTodo />} />  // view employees
          {/* <Route path="leaves" element={<HrLeaves />} />        // approve/reject leave */}
          <Route path="leaves/apply" element={<EmployeeApplyLeave />} /> 
          
          <Route path="leaves/summary" element={<EmployeeLeaveSummary />} /> 
               
          <Route path="tasks/details" element={<EmployeeTaskDetails />} />
          <Route path="attendance" element={<EmployeeAttendance />} /> // attendance
          <Route path="settings/change-password" element={<EmployeeChangePassword />} />
          <Route path="settings/profile" element={<EmployeeProfile />} />
          <Route path="notification" element={<EmployeeNotification />} /> // notifications
          <Route path="update-task/:id" element={<EmployeeUpdateTask />} />
        </Route>
          <Route path="empemployeeUpdateById/:id" element={<EmployeeEditEmployee />} />
      </Routes>
    </Router>
  );
}

export default App;
