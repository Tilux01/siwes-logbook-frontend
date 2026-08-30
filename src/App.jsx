import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import SignIn from '../pages/signin'
import SignUp from '../pages/signup'
import StudentDashboard from '../pages/StudentDashboard'
import DailyLogs from '../pages/DailyLogs'
import SupervisorDashboard from '../pages/SupervisorDashboard'
import CoordinatorDashboard from '../pages/CoordinatorDashboard'
import AdminSignin from '../pages/AdminSignin'
import AdminDashboard from '../pages/AdminDashboard'
import OtpVerification from '../pages/OtpVerification'
import SupervisionLogin from '../pages/SupervisionLogin'
import SchoolSupervisorSignup from '../pages/SchoolSupervisorSignup'
import CoordinatorLogin from '../pages/CoordinatorLogin'
import Support from '../pages/Support'
import SchoolPage from '../pages/SchoolPage'
import AccountType from '../pages/AccountType'
import SchoolSignup from '../pages/School/SchoolSignup'
import SchoolSignup2 from '../pages/School/SchoolSignup2'
import SchoolSignin from '../pages/School/SchoolSignin'
import SchoolDashboard from '../pages/School/SchoolDashboard'
import { createContext, useState } from 'react'
import SchoolStudentDashboard from '../pages/School/SchoolStudentDashboard'
import SchoolDepartmentDashboard from '../pages/School/SchoolDepartmentDashboard'
import SchoolDashbaordSupervisor from '../pages/School/SchoolDashbaordSupervisor'
import OrganizationSignup from '../pages/Organization/OrganizationSignup'
import OrganizationSignin from '../pages/Organization/OrganizationSignin'
import OrganizationDashboard from '../pages/Organization/OrganizationDashboard'
import OrgSupervisorSignup from '../pages/OrganizationSupervisor/OrgSupervisorSignup'
import OrgSupervisorSignin from '../pages/OrganizationSupervisor/OrgSupervisorSignin'
import OrgSupervisorDashboard from '../pages/OrganizationSupervisor/OrgSupervisorDashboard'
import StudentPerformanceView from '../pages/OrganizationSupervisor/StudentPerformanceView'

export const context = createContext()
const App = () => {
  const [schoolCred, setSchoolCred] = useState()
  const [studentCred, setStudentCred] = useState()
  const [studentList, setStudentList] = useState([])
  const [schoolDepartments, setSchoolDepartments] = useState([])
  const [schoolSupervisors, setSchoolSupervisors] = useState([])
  const [schoolSupervisorCred, setSchoolSupervisorCred] = useState()
  const [organizationCred, setOrganizationCred] = useState()
  const [organizationSupervisorCred, setOrganizationSupervisorCred] = useState()
  const [adminCred, setAdminCred] = useState()

  return (
    <context.Provider value={{
      schoolCred, setSchoolCred,
      studentCred, setStudentCred,
      studentList, setStudentList,
      schoolDepartments, setSchoolDepartments,
      schoolSupervisors, setSchoolSupervisors,
      schoolSupervisorCred, setSchoolSupervisorCred,
      organizationCred, setOrganizationCred,
      organizationSupervisorCred, setOrganizationSupervisorCred,
      adminCred, setAdminCred
    }}>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/SignIn" element={<SignIn />} />
        <Route path="/signup" element={<SignUp/>} />
        
        {/* School Routes */}
        <Route path="/school/signup" element={<SchoolSignup/>} />
        <Route path="/school/signup/proceed" element={<SchoolSignup2/>} />
        <Route path="/school/signin" element={<SchoolSignin/>} />
        <Route path="/school/dashboard" element={<SchoolDashboard/>} />
        <Route path="/school/dashboard/student" element={<SchoolStudentDashboard/>} />
        <Route path="/school/dashboard/department" element={<SchoolDepartmentDashboard/>} />
        <Route path="/school/dashboard/supervisor" element={<SchoolDashbaordSupervisor/>} />

        {/* Organization Routes */}
        <Route path="/organization/signup" element={<OrganizationSignup/>} />
        <Route path="/organization/signin" element={<OrganizationSignin/>} />
        <Route path="/organization/dashboard" element={<OrganizationDashboard/>} />

        {/* Organization Supervisor Routes */}
        <Route path="/organization-supervisor/signup" element={<OrgSupervisorSignup/>} />
        <Route path="/organization-supervisor/signin" element={<OrgSupervisorSignin/>} />
        <Route path="/organization-supervisor/dashboard" element={<OrgSupervisorDashboard/>} />
        <Route path="/student-performance/:id" element={<StudentPerformanceView/>} />

        {/* Student & Academic Supervisor Routes */}
        <Route path="/student-dashboard" element={<StudentDashboard/>}/>
        <Route path="/student-dashboard/daily-logs" element={<DailyLogs/>}/>
        <Route path="/supervisor-dashboard" element={<SupervisorDashboard/>}/>

        <Route path="/coordinator-dashboard" element={<CoordinatorDashboard/>}/>
        <Route path="/Admin" element={<AdminSignin/>}/>
        <Route path="/Admin/Dashboard" element={<AdminDashboard/>}/>
        <Route path="/OTP-Verification" element={<OtpVerification/>} />
        <Route path="/Supervisor-Login" element={<SupervisionLogin/>} />
        <Route path="/school/supervisor/signup" element={<SchoolSupervisorSignup/>} />
        <Route path="/Coordinator-Login" element={<CoordinatorLogin/>} />
        <Route path="/Support" element={<Support/>} />
        <Route path="/School" element={<SchoolPage/>} />
        <Route path="/register/accountType" element={<AccountType/>}/>   
      </Routes>
    </context.Provider>
  )
}

export default App