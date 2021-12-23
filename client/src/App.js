import "./App.css";
import { useAuth0 } from "@auth0/auth0-react";
import Login from "./components/Login/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Loading from "./components/pages/Loading/Loading";
import NotFound from "./components/pages/NotFound/NotFound";
import drizzle from "./drizzle";
import { DrizzleContext } from "@drizzle/react-plugin";

function App() {
  const { isLoading, isAuthenticated } = useAuth0();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          exact
          element={
            isAuthenticated ? (
                <Dashboard />
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Login />}
        />
        <Route
          path="/dashboard/oauth2callback"
          element={isAuthenticated ? <Dashboard /> : <Login />}
        />
        <Route element={NotFound} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
