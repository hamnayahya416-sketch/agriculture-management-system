import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./auth/ProtectedRoute";
import AppShell from "./common/AppShell";
import Toast from "./common/Toast";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Crops from "./pages/Crops";
import HarvestOrders from "./pages/HarvestOrders";
import Buyers from "./pages/Buyers";
import Tasks from "./pages/Tasks";
import Expenses from "./pages/Expenses";
import Inventory from "./pages/Inventory";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <>
      <Toast />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/crops" element={<Crops />} />
            <Route path="/harvest-orders" element={<HarvestOrders />} />
            <Route path="/buyers" element={<Buyers />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}
