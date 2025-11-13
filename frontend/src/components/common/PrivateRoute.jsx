import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useStore } from '../../store/useStore';

const PrivateRoute = () => {
  const { user } = useStore();
  
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
