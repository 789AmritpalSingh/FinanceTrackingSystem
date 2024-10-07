import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/user_authorization/login";
import SignUp from "./components/user_authorization/SignUp";
import NavBar from "./components/navigation/NavBar";
import LandingPage from "./components/pages/LandingPage";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import PersonalExpenses from "./components/pages/PersonalExpenses";
import ProtectedRoute from "./components/ProtectedRoute";
import { Provider } from "react-redux";
import {store} from './redux/store';

const theme = createTheme({
  palette: {
    background: {
      default: "#1A1A1A", // Set your background color here
    },
  },
});

function App() {

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Add this to reset styles globally */}
      <Provider store={store}> {/* Wrap the app in Redux Provider */}
        <Router>
          <NavBar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            {/* Wrap protected routes in PrivateRoute */}
            <Route
              path="/personal_expenses"
              element={
                <ProtectedRoute>
                  <PersonalExpenses />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </Provider>
    </ThemeProvider>
  );
}

export default App;
