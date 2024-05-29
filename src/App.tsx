import React from "react";
import { Routes, Route } from "react-router-dom";
import styled from "styled-components";

import AuthProvider from "./app/context/AuthProvider";
import PrivateRoute from "./app/context/PrivateRoute";

import LandingPage from "./pages/landingPage";

import MoviesScreen from "./components/molekul/movies";
import WatclisthScreen from "./components/molekul/watchlist";

const Pages = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  h1 {
    font-size: calc(2rem + 2vw);
    background: linear-gradient(to right, #803bec 30%, #1b1b1b 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

function App() {
  return (
    <AuthProvider>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/movies"
          element={
            <PrivateRoute>
              <MoviesScreen />
            </PrivateRoute>
          }
        />
        <Route
          path="/watchlist"
          element={
            <PrivateRoute>
              <WatclisthScreen />
            </PrivateRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
