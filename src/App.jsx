import { BrowserRouter} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";

import AppRoutes from "./App.routes";
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <AppRoutes/>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
