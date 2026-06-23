import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import SearchModal from '@/components/SearchModal';
import HomePage from '@/pages/HomePage';
import DailyReportPage from '@/pages/DailyReport';
import CompaniesPage from '@/pages/Companies';
import ResearchPage from '@/pages/Research';
import CasesPage from '@/pages/Cases';
import GlossaryPage from '@/pages/Glossary';
import DashboardPage from '@/pages/Dashboard';
import EventsPage from '@/pages/Events';
import AdminPage from '@/pages/Admin';

export default function App() {
  return (
    <BrowserRouter>
      <SearchModal />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/daily" element={<DailyReportPage />} />
          <Route path="/companies" element={<CompaniesPage />} />
          <Route path="/research" element={<ResearchPage />} />
          <Route path="/cases" element={<CasesPage />} />
          <Route path="/readings" element={<Navigate to="/research" replace />} />
          <Route path="/glossary" element={<GlossaryPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
