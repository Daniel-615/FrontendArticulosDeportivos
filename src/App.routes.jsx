import RegisterPage from "./pages/auth-service/user/RegisterPage";
import LoginPage from "./pages/auth-service/user/LoginPage";
import RegisterEmployeePage from "./pages/auth-service/user/RegisterEmployee";
import HomePage from "./pages/auth-service/user/HomePage";
import ForgotPasswordPage from "./pages/auth-service/user/forgotPasswordPage";
import ResetPasswordPage from "./pages/auth-service/user/resetPasswordPage";
import UpdateUserPage from "./pages/auth-service/user/crud/UpdateUserPage";
import ShenronAnimation from "./pages/shenronAnimation";
import AdminPanel from "./pages/auth-service/user/crud/AdminPanel.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import { Routes, Route } from "react-router-dom";
import UnauthorizedPage from "./pages/UnauthorizedPage.jsx";
import AdminPermiso from "./pages/auth-service/permiso/AdminPermiso.jsx";
import AdminRol from "./pages/auth-service/rol/AdminRol.jsx";
import AdminRolPermiso from "./pages/auth-service/rol-permiso/AdminRolPermiso.jsx";
import PageNotFound from "./pages/pageNotFound.jsx";
import ProductosCardView from "./pages/product-service/ProductoCardView.jsx";
import CrearProductoForm from "./pages/product-service/CrearProductoForm.jsx";
import ProductosCrudForm from "./pages/product-service/ProductoForm.jsx";
import InicioEmpleado from "./pages/InicioEmpledao.jsx";
import CategoriasCrudForm from "./pages/product-service/CategoriasForm.jsx";
import MarcasCrudForm from "./pages/product-service/MarcasForm.jsx";
import 'react-toastify/dist/ReactToastify.css';
import WishlistPage from "./pages/WishlistPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import TallasCrudForm from "./pages/product-service/TallaForm.jsx";
import ProductoColorForm from "./pages/product-service/ProductoColorForm.jsx";
import ProductoTallaCrudForm from "./pages/product-service/ProductoTallaForm.jsx";
import ColorCrudForm from "./pages/product-service/ColorForm.jsx";
import PublicWishlist from "./pages/PublicWishlistPage.jsx";
import PaymentSuccess from "./pages/checkout/paymentSuccess.jsx";
import PaymentCancel from "./pages/checkout/paymentCancel.jsx"; 
import EnviosManager from "./pages/envio-service/EnvioForm.jsx";
function AppRoutes(){
    const {isAuthenticated,user}= useAuth();
    return (
        <Routes>
            {/* Públicas */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="*" element={<PageNotFound />} />
            <Route path="/wishlist/shared/:shareId" element={<PublicWishlist/>}/>
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/cancel" element={<PaymentCancel />} />
            {/* Protegidas */}
            <Route path="/" element={
                <ProtectedRoute>
                    <HomePage />
                </ProtectedRoute>
            } />
            <Route path="/register-employee" element={
                <ProtectedRoute>
                    {user?.rol?.includes('admin') ? (
                    <RegisterEmployeePage />
                    ) : (
                    <UnauthorizedPage />
                    )}
                </ProtectedRoute>
            } />

            <Route
                path="/admin-permiso"
                element={
                    <ProtectedRoute>
                    {user?.rol.includes('admin') ? (
                        <AdminPermiso />
                    ) : (
                        <UnauthorizedPage />
                    )}
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin-rol"
                element={
                    <ProtectedRoute>
                    {user?.rol.includes('admin') ? (
                        <AdminRol />
                    ) : (
                        <UnauthorizedPage />
                    )}
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin-rol-permiso"
                element={
                    <ProtectedRoute>
                    {user?.rol.includes('admin') ? (
                        <AdminRolPermiso />
                    ) : (
                        <UnauthorizedPage />
                    )}
                    </ProtectedRoute>
                }
            />
            <Route path="/admin-panel" element={
                <ProtectedRoute>
                    {user?.rol?.includes('admin') ? (
                    <AdminPanel />
                    ) : (
                    <UnauthorizedPage />
                    )}
                </ProtectedRoute>
            } />
             <Route path="/empleado-panel" element={
                <ProtectedRoute>
                    {user?.rol?.some(r => r === 'admin' || r==='empleado') ? (
                    <InicioEmpleado />
                    ) : (
                    <UnauthorizedPage />
                    )}
                </ProtectedRoute>
            } />
            <Route
                path="/user/profile/"
                element={
                    <ProtectedRoute>
                    {user?.rol?.some(r => r === 'admin' || r === 'cliente') ? (
                        <UpdateUserPage />
                    ) : (
                        <UnauthorizedPage />
                    )}
                    </ProtectedRoute>
                }
            />
            <Route
                path="/producto/"
                element={
                    <ProtectedRoute>
                    {user?.rol?.some(r => r === 'admin' || r === 'cliente' || r==='empleado') ? (
                        <ProductosCardView />
                    ) : (
                        <UnauthorizedPage />
                    )}
                    </ProtectedRoute>
                }
            />
            <Route
                path="/crear/producto"
                element={
                    <ProtectedRoute>
                    {user?.rol?.some(r => r === 'admin' || r==='empleado') ? (
                        <CrearProductoForm />
                    ) : (
                        <UnauthorizedPage />
                    )}
                    </ProtectedRoute>
                }
            />
            <Route
                path="/envio"
                element={
                    <ProtectedRoute>
                    {user?.rol?.some(r => r === 'admin' || r==='empleado') ? (
                        <EnviosManager />
                    ) : (
                        <UnauthorizedPage />
                    )}
                    </ProtectedRoute>
                }
            />
            <Route
                path="/envio/tarifas"
                element={
                    <ProtectedRoute>
                    {user?.rol?.some(r => r === 'admin' || r === 'empleado') ? (
                        <TarifaEnvioForm />
                    ) : (
                        <UnauthorizedPage />
                    )}
                    </ProtectedRoute>
                }
            />  

            <Route
                path="/carrito"
                element={
                    <ProtectedRoute>
                    {user?.rol?.some(r => r === 'admin' || r === 'cliente' ) ? (
                        <CartPage />
                    ) : (
                        <UnauthorizedPage />
                    )}
                    </ProtectedRoute>
                }
                />

                <Route
                path="/wishlist"
                element={
                    <ProtectedRoute>
                    {user?.rol?.some(r => r === 'admin' || r === 'cliente' ) ? (
                        <WishlistPage />
                    ) : (
                        <UnauthorizedPage />
                    )}
                    </ProtectedRoute>
                }
                />
            <Route
                path="/crear/categoria"
                element={
                    <ProtectedRoute>
                    {user?.rol?.some(r => r === 'admin' || r==='empleado') ? (
                        <CategoriasCrudForm />
                    ) : (
                        <UnauthorizedPage />
                    )}
                    </ProtectedRoute>
                }
            />
            <Route
                path="/crear/talla"
                element={
                    <ProtectedRoute>
                    {user?.rol?.some(r => r === 'admin' || r==='empleado') ? (
                        <TallasCrudForm />
                    ) : (
                        <UnauthorizedPage />
                    )}
                    </ProtectedRoute>
                }
            />
            <Route
                path="/crear/color"
                element={
                    <ProtectedRoute>
                    {user?.rol?.some(r => r === 'admin' || r==='empleado') ? (
                        <ColorCrudForm />
                    ) : (
                        <UnauthorizedPage />
                    )}
                    </ProtectedRoute>
                }
            />
            <Route
                path="/crear/color/producto"
                element={
                    <ProtectedRoute>
                    {user?.rol?.some(r => r === 'admin' || r==='empleado') ? (
                        <ProductoColorForm />
                    ) : (
                        <UnauthorizedPage />
                    )}
                    </ProtectedRoute>
                }
            />
            <Route
                path="/crear/talla/producto"
                element={
                    <ProtectedRoute>
                    {user?.rol?.some(r => r === 'admin' || r==='empleado') ? (
                        <ProductoTallaCrudForm />
                    ) : (
                        <UnauthorizedPage />
                    )}
                    </ProtectedRoute>
                }
            />
            <Route
                path="/crear/marca"
                element={
                    <ProtectedRoute>
                    {user?.rol?.some(r => r === 'admin' || r==='empleado') ? (
                        <MarcasCrudForm />
                    ) : (
                        <UnauthorizedPage />
                    )}
                    </ProtectedRoute>
                }
            />
            <Route
                path="/actualizar/producto"
                element={
                    <ProtectedRoute>
                    {user?.rol?.some(r => r === 'admin' || r==='empleado') ? (
                        <ProductosCrudForm />
                    ) : (
                        <UnauthorizedPage />
                    )}
                    </ProtectedRoute>
                }
            />
            <Route path="/user/deactivateAccount/:id" element={
                <ProtectedRoute>
                    <h1>desactivar</h1>
                </ProtectedRoute>
            } />
            <Route path="/user/findOne/:id" element={
                <ProtectedRoute>
                    <h1>buscar usuario por id</h1>
                </ProtectedRoute>
            } />
            <Route path="/user/findAll" element={
                <ProtectedRoute>
                <h1>findall</h1>
                </ProtectedRoute>
            } />
            <Route path="/user/findAllActivos" element={
                <ProtectedRoute>
                <h1>Activos</h1>
                </ProtectedRoute>
            } />
            <Route path="/user/delete/:id" element={
                <ProtectedRoute>
                <h1>eliminar user</h1>
                </ProtectedRoute>
            } />

            {/* Roles */}
            <Route path="/rol" element={
                <ProtectedRoute>
                <h1>obtener roles</h1>
                </ProtectedRoute>
            } />
            <Route path="/add-rol" element={
                <ProtectedRoute>
                <h1>añadir rol</h1>
                </ProtectedRoute>
            } />
            <Route path="/rol/:id" element={
                <ProtectedRoute>
                <h1>obtener rol id</h1>
                </ProtectedRoute>
            } />
            <Route path="/rol/update/:id" element={
                <ProtectedRoute>
                <h1>actualizar rol</h1>
                </ProtectedRoute>
            } />
            <Route path="/rol/delete/:id" element={
                <ProtectedRoute>
                <h1>eliminar rol</h1>
                </ProtectedRoute>
            } />

            {/* Permisos */}
            <Route path="/permiso" element={
                <ProtectedRoute>
                <h1>obtener permisos</h1>
                </ProtectedRoute>
            } />
            <Route path="/add-permiso" element={
                <ProtectedRoute>
                <h1>añadir permiso</h1>
                </ProtectedRoute>
            } />
            <Route path="/permiso/:id" element={
                <ProtectedRoute>
                <h1>obtener permiso por id</h1>
                </ProtectedRoute>
            } />
            <Route path="/permiso/update/:id" element={
                <ProtectedRoute>
                <h1>actualizar permiso</h1>
                </ProtectedRoute>
            } />
            <Route path="/permiso/delete/:id" element={
                <ProtectedRoute>
                <h1>eliminar permiso</h1>
                </ProtectedRoute>
            } />

            {/* RolPermiso */}
            <Route path="/rol-permiso" element={
                <ProtectedRoute>
                <h1>obtener rol por permisos</h1>
                </ProtectedRoute>
            } />
            <Route path="/add-rol-permiso" element={
                <ProtectedRoute>
                <h1>añadir rol permiso</h1>
                </ProtectedRoute>
            } />
            <Route path="/rol-permiso/:rolId/:permisoId" element={
                <ProtectedRoute>
                <h1>obtener rol permiso por id</h1>
                </ProtectedRoute>
            } />
            <Route path="/rol-permiso/delete/:rolId/:permisoId" element={
                <ProtectedRoute>
                <h1>eliminar rol permiso</h1>
                </ProtectedRoute>
            } />

            {/* UsuarioRol */}
            <Route path="/usuario-rol" element={
                <ProtectedRoute>
                <h1>obtener usuarios rol</h1>
                </ProtectedRoute>
            } />
            <Route path="/add-usuario-rol" element={
                <ProtectedRoute>
                <h1>añadir usuario rol</h1>
                </ProtectedRoute>
            } />
            <Route path="/usuario-rol/:usuarioId/:rolId" element={
                <ProtectedRoute>
                <h1>obtener usuario rol por id</h1>
                </ProtectedRoute>
            } />
            <Route path="/usuario-rol/delete/:usuarioId/:rolId" element={
                <ProtectedRoute>
                <h1>eliminar usuario rol</h1>
                </ProtectedRoute>
            } />

          {/* Shenron */}
          <Route path="/shenron" element={
            <ProtectedRoute>
              <ShenronAnimation />
            </ProtectedRoute>
          } />
        </Routes>
  );
}

export default AppRoutes;