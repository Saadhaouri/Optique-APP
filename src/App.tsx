import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import authStore from "./Auth/authStore";
import Header from "./Components/Header";
import CategoryPage from "./Pages/CategoryPage";
import DashboardPage from "./Pages/DashboardPage";
import LoginPage from "./Pages/LoginPage";
import OrderPage from "./Pages/OrderPage";
import ProductPage from "./Pages/ProductPage";
import FournisseurPage from "./Pages/FournisseurPage";
import UserManegement from "./Pages/UserManegement";
import SideMenu from "./Components/SideMenu";
import ForgotPasswordPage from "./Pages/ForgotPasswordPage";
import VentePage from "./Pages/VentePage";
import ProtectedRoute from "./Auth/ProtectedRoute";
import VisitePage from "./Pages/VisitePage";
import DatabasePage from "./Pages/DatabasePage";
import FacturePage from "./Pages/FacturePage";

const queryClient = new QueryClient();

function App() {
  const isAuth = authStore((state) => state.isAuth);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col h-screen">
        <Router>
          {isAuth && <Header />}
          <div className="flex flex-1 overflow-hidden">
            {isAuth && <SideMenu />}
            <main className="flex-1 overflow-y-auto bg-gray-100">
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route
                  path="/forgot-password"
                  element={<ForgotPasswordPage />}
                />
                <Route
                  path="/"
                  element={<ProtectedRoute element={<DashboardPage />} />}
                />
                <Route
                  path="/profile"
                  element={<ProtectedRoute element={<UserManegement />} />}
                />
                <Route
                  path="/order"
                  element={<ProtectedRoute element={<OrderPage />} />}
                />
                <Route
                  path="/clients"
                  element={<ProtectedRoute element={<VisitePage />} />}
                />
                <Route
                  path="/supplier"
                  element={<ProtectedRoute element={<FournisseurPage />} />}
                />
                
                <Route
                  path="/categories"
                  element={<ProtectedRoute element={<CategoryPage />} />}
                />
                <Route
                  path="/products"
                  element={<ProtectedRoute element={<ProductPage />} />}
                />
                <Route
                  path="/facture"
                  element={<ProtectedRoute element={<FacturePage />} />}
                />
                <Route
                  path="/vente"
                  element={<ProtectedRoute element={<VentePage />} />}
                />
                <Route
                  path="/database"
                  element={<ProtectedRoute element={<DatabasePage />} />}
                />

                <Route
                  path="/orders"
                  element={<ProtectedRoute element={<OrderPage />} />}
                />
              </Routes>
            </main>
          </div>
        </Router>
        <ToastContainer />
      </div>
    </QueryClientProvider>
  );
}

export default App;
