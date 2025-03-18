import{ Routes, Route, BrowserRouter, } from 'react-router-dom';

import { AuthGuard } from './AuthGuard';
import { Login } from '../view/pages/Login';
import { Register } from '../view/pages/Register';
import { Dashboard } from '../view/pages/Dashboard';
import { AuthLayout } from '../view/layouts/AuthLayout';

export function Router(){
  return (
    <BrowserRouter future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    }}>
      <Routes>
        <Route element={<AuthGuard isPrivate={false}/>}>
          <Route element={<AuthLayout/>}>
            <Route path="/login" element={<Login/>}></Route>
            <Route path="/register" element={<Register/>}></Route>
          </Route>
        </Route>

        {/* Private routes */}
        <Route element={<AuthGuard isPrivate/>}>
          <Route path="/" element={<Dashboard/>}></Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );


}