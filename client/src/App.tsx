import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './components/Layout/MainLayout'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Management from './pages/Management'
import Collaboration from './pages/Collaboration'
import CodeRepository from './pages/CodeRepository'
import Integration from './pages/Integration'
import TestOverview from './pages/Test/TestOverview'
import TestPlans from './pages/Test/TestPlans'
import TestCaseDesign from './pages/Test/TestCaseDesign'
import TestExecution from './pages/Test/TestExecution'
import TestReport from './pages/Test/TestReport'
import TestProgress from './pages/Test/TestProgress'
import HistoricalReports from './pages/Test/HistoricalReports'
import UITest from './pages/Test/UITest'
import APITest from './pages/Test/APITest'
import JMeterTest from './pages/Test/JMeterTest'
import Artifacts from './pages/Artifacts'
import Deployment from './pages/Deployment'
import Settings from './pages/Settings'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Routes>
                  <Route path="/" element={<Navigate to="/home" replace />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/management" element={<Management />} />
                  <Route path="/collaboration" element={<Collaboration />} />
                  <Route path="/code-repository" element={<CodeRepository />} />
                  <Route path="/integration" element={<Integration />} />
                  <Route path="/test/overview" element={<TestOverview />} />
                  <Route path="/test/plans" element={<TestPlans />} />
                  <Route path="/test/case-design" element={<TestCaseDesign />} />
                  <Route path="/test/execution" element={<TestExecution />} />
                  <Route path="/test/report" element={<TestReport />} />
                  <Route path="/test/progress" element={<TestProgress />} />
                  <Route path="/test/historical-reports" element={<HistoricalReports />} />
                  <Route path="/test/ui-test" element={<UITest />} />
                  <Route path="/test/api-test" element={<APITest />} />
                  <Route path="/test/jmeter-test" element={<JMeterTest />} />
                  <Route path="/artifacts" element={<Artifacts />} />
                  <Route path="/deployment" element={<Deployment />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default App

