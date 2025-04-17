import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/home";
import Event from "./pages/event";
import Gallery from "./pages/galerry";
import Clients from "./pages/client";
import Artikel from "./pages/artikel";
import MainLayout from "./layout/layout";
import AdminLayout from "./layout/layoutAdmin";
import Index from "./pages/admin/index";
import ClientAdmin from "./pages/admin/ClientAdmin";
import EventAdmin from "./pages/admin/eventAdmin";
import GalleryAdmin from "./pages/admin/galerryAdmin";
import Contact from "./pages/kontak"
import ProtectedRoute from './components/ProtectedRoute';
import StoreAdmin from './pages/admin/adminPanel'
import Store from './pages/product'
import Footer from './components/footer'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* public */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* frontend */}
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/store" element={<MainLayout><Store /></MainLayout>} />
        <Route path="/event" element={<MainLayout><Event /></MainLayout>} />
        <Route path="/gallery" element={<MainLayout><Gallery /></MainLayout>} />
        <Route path="/clients" element={<MainLayout><Clients /></MainLayout>} />
        <Route path="/kontak" element={<MainLayout><Contact /></MainLayout>} />
        <Route path="/artikel" element={<MainLayout><Artikel /></MainLayout>} />

        {/* admin: dibungkus ProtectedRoute */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Index />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/client"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <ClientAdmin />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/eventAdmin"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <EventAdmin />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
           <Route
          path="/produkAdmin"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <StoreAdmin />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/galleryAdmin"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <GalleryAdmin />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer/>
    </BrowserRouter>
  );
}

export default App;
