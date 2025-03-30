import { Dashboard } from "../components/dashboard";

const DashboardPage = () => {
  const user = {
    role: "user",
  };
  return (
    <div>{user.role === "user" ? <Dashboard /> : <h1>Admin Dashboard</h1>}</div>
  );
};

export default DashboardPage;
