import React from "react";

import { useAuth } from "../app/context/AuthProvider";

const Dashboard = () => {
  const context = useAuth();
  return <div>Dashboard</div>;
};
export default Dashboard;
