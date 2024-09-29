import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/user_authorization/login";
import SignUp from "./components/user_authorization/SignUp";
import NavBar from "./components/navigation/NavBar";
import LandingPage from "./components/pages/LandingPage";
import { CssBaseline } from "@mui/material";

function App() {
  return (
    <>
      <CssBaseline /> {/* Add this to reset styles globally */}
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
