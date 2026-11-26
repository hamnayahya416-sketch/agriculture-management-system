import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext.js";
import ProtectedRoute from "./auth/ProtectedRoute.js";
import AdminRoute from "./auth/AdminRoute.js";
import AppShell from "./components/common/AppShell.js";
import Toast from "./components/common/Toast.js";
import Login from "./views/Login.js";
import Dashboard from "./views/Dashboard.js";
import Crops from "./views/Crops.js";
import HarvestOrders from "./views/HarvestOrders.js";
import Buyers from "./views/Buyers.js";
import Tasks from "./views/Tasks.js";
import Expenses from "./views/Expenses.js";
import Inventory from "./views/Inventory.js";
import Workers from "./views/Workers.js";
import Attendance from "./views/Attendance.js";
import Equipment from "./views/Equipment.js";
import Maintenance from "./views/Maintenance.js";
import Users from "./views/Users.js";
import Reports from "./views/Reports.js";
import NotFound from "./views/NotFound.js";

export default function App() {
  return (
    <AuthProvider>
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
            <Route path="/workers" element={<Workers />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/equipment" element={<Equipment />} />
            <Route path="/maintenance" element={<Maintenance />} />
            <Route
              path="/users"
              element={
                <AdminRoute>
                  <Users />
                </AdminRoute>
              }
            />
            <Route path="/reports" element={<Reports />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}
