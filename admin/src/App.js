import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Festivals from './pages/Festivals';
import Blogs from './pages/Blogs';
import Prayers from './pages/Prayers';
import Templates from './pages/Templates';
import Banners from './pages/Banner';
import Masters from './pages/Masters';
import Practices from './pages/Practices';
import Items from './pages/Items';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="festivals" element={<Festivals />} />
        <Route path="blogs" element={<Blogs />} />
        <Route path="prayers" element={<Prayers />} />

        {/* Admin management pages */}
        <Route path="templates" element={<Templates />} />
        <Route path="banners" element={<Banners />} />
        <Route path="masters" element={<Masters />} />
        <Route path="practices" element={<Practices />} />
        <Route path="items" element={<Items />} />
      </Route>

      {/* fallback to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}