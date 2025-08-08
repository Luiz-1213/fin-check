import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { AuthLayout } from '../view/layouts/AuthLayout';
import { Dashboard } from '../view/pages/Dashboard';
import { GoogleCallback } from '../view/pages/GoogleCallback';
import { Login } from '../view/pages/Login';
import { Register } from '../view/pages/Register';
import { AuthGuard } from './AuthGuard';

export function Router() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route element={<AuthGuard isPrivate={false} />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/register" element={<Register />}></Route>
          </Route>
          <Route path="/callbacks/google" element={<GoogleCallback />}></Route>
        </Route>

        {/* Private routes */}
        <Route element={<AuthGuard isPrivate />}>
          <Route path="/" element={<Dashboard />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
