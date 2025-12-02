import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import GuestLayout from "./layouts/GuestLayout";
import StaffLayout from "./layouts/StaffLayout";
import RequireAuth from "./components/RequireAuth";

// Public Pages
import HomePage from "./pages/HomePage";
import RoomsPage from "./pages/RoomsPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";
import StaffLogin from "./pages/staff/StaffLogin";

// Guest Pages
import GuestDashboardPage from "./pages/GuestDashboardPage";
import LaundryPage from "./pages/guest/Laundry";
import DiningPage from "./pages/guest/Dining";
import HousekeepingPage from "./pages/guest/Housekeeping";
import MyBill from "./pages/guest/MyBill";

// Staff Pages
import LaundryManager from "./pages/admin/LaundryManager";
import KitchenDisplay from "./pages/admin/KitchenDisplay";
import StaffCheckInPage from "./pages/admin/StaffCheckInPage";
import MenuManager from "./pages/admin/MenuManager";
import HousekeepingMap from "./pages/admin/HousekeepingMap";
import CheckoutManager from "./pages/staff/CheckoutManager";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* WORLD 1: PUBLIC */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/stafflogin" element={<StaffLogin />} />
        </Route>

        {/* WORLD 2: GUEST (Protected) */}
        <Route element={
          <RequireAuth role="guest">
            <GuestLayout />
          </RequireAuth>
        }>
          <Route path="/dashboard" element={<GuestDashboardPage />} />
          <Route path="/laundry" element={<LaundryPage />} />
          <Route path="/dining" element={<DiningPage />} />
          <Route path="/housekeeping" element={<HousekeepingPage />} />
          <Route path="/bill" element={<MyBill />} />
        </Route>

        {/* WORLD 3: STAFF (Protected) */}
        <Route element={
          <RequireAuth role="staff">
            <StaffLayout />
          </RequireAuth>
        }>
          <Route path="/admin/laundry" element={<LaundryManager />} />
          <Route path="/admin/kitchen" element={<KitchenDisplay />} />
          <Route path="/admin/menu" element={<MenuManager />} />
          <Route path="/admin/housekeeping" element={<HousekeepingMap />} />
          <Route path="/admin/register" element={<StaffCheckInPage />} />
          <Route path="/admin/checkout" element={<CheckoutManager />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
