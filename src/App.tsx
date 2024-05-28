import React from "react";
import { Routes, Route } from "react-router-dom";

import AuthProvider from "./app/context/AuthProvider";
import PrivateRoute from "./app/context/PrivateRoute";

import LandingPage from "./pages/landingPage";
import Dashboard from "./pages/dashboard";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;