import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/auth-service/user/RegisterPage";
import LoginPage from "./pages/auth-service/user/LoginPage";
import RegisterEmployeePage from "./pages/auth-service/user/RegisterEmployee";
import HomePage from "./pages/auth-service/user/HomePage";
import ForgotPasswordPage from "./pages/auth-service/user/forgotPasswordPage";
import ResetPasswordPage from "./pages/auth-service/user/resetPasswordPage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        /*Crud Usuario */
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/register" element={<RegisterPage/>} />
        <Route path="/register-employee" element={<RegisterEmployeePage/>}/>
        <Route path="/refresh-token" element={<h1>refreshToken</h1>} />
        <Route path="/forgot-password" element={<ForgotPasswordPage/>} />
        <Route path="/reset-password/" element={<ResetPasswordPage />} />


        <Route path="/user/update/:id" element={<h1>update</h1>} />
        <Route path="/user/deactivateAccount/:id" element={<h1>desactivar</h1>} />
        <Route path="/user/findOne/:id" element={<h1>buscar usuario por id</h1>} />
        <Route path="/user/findAll" element={<h1>findall</h1>} />
        <Route path="/user/findAllActivos" element={<h1>Activos</h1>} />
        <Route path="/user/delete/:id" element={<h1>eliminar user</h1>} />
        
        /*Crud Rol */
        <Route path="/rol" element={<h1>obtener roles</h1>} />
        <Route path="/add-rol" element={<h1>añadir rol</h1>} />
        <Route path="/rol/:id" element={<h1>obtener rol id</h1>} />
        <Route path="/rol/update/:id" element={<h1>actualizar rol</h1>} />
        <Route path="/rol/delete/:id" element={<h1>eliminar rol</h1>} />
        /*Crud Permiso */
        <Route path="/permiso" element={<h1>obtener permisos</h1>} />
        <Route path="/add-permiso" element={<h1>añadir permiso</h1>} />
        <Route path="/permiso/:id" element={<h1>obtener permiso por id</h1>} />
        <Route path="/permiso/update/:id" element={<h1>actualizar permiso</h1>} />
        <Route path="/permiso/delete/:id" element={<h1>eliminar permiso</h1>} />
        /*Crud RolPermiso */
        <Route path="/rol-permiso" element={<h1>obtener rol por permisos</h1>} />
        <Route path="/add-rol-permiso" element={<h1>añadir rol permiso</h1>} />
        <Route path="/rol-permiso/:rolId/:permisoId" element={<h1>obtener rol permiso por id</h1>} />
        <Route path="/rol-permiso/delete/:rolId/:permisoId" element={<h1>eliminar rol permiso</h1>} />
        /*Crud usuarioRol */
        <Route path="/usuario-rol/" element={<h1>obtener usuarios rol</h1>} />
        <Route path="/add-usuario-rol/" element={<h1>añadir usuario rol</h1>} />
        <Route path="/usuario-rol/:usuarioId/:rolId" element={<h1>obtener usuario rol por id</h1>} />
        <Route path="/usuario-rol/delete/:usuarioId/:rolId" element={<h1>eliminar usuario rol</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
