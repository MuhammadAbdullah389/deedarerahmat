import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import HajjPackages from "./pages/HajjPackages";
import UmrahPackages from "./pages/UmrahPackages";
import VisaAssistance from "./pages/VisaAssistance";
import FAQs from "./pages/FAQs";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import ForcedPasswordChange from "./pages/portal/ForcedPasswordChange";
import DocumentUploadPortal from "./pages/portal/DocumentUploadPortal";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminPackages from "./pages/admin/AdminPackages";
import AdminHotels from "./pages/admin/AdminHotels";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminTestimonials from "./pages/admin/AdminTestimonials";
import AdminDocumentReview from "./pages/admin/AdminDocumentReview";
import UserOverview from "./pages/user/UserOverview";
import UserBookings from "./pages/user/UserBookings";
import UserTestimonials from "./pages/user/UserTestimonials";
import UserApply from "./pages/user/UserApply";

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/hajj-packages" element={<HajjPackages />} />
          <Route path="/umrah-packages" element={<UmrahPackages />} />
          <Route path="/visa-assistance" element={<VisaAssistance />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />

          {/* Auth Routes */}
          <Route path="/auth/sign-in" element={<SignIn />} />
          <Route path="/auth/sign-up" element={<SignUp />} />

          {/* Portal Routes (Public - for applicants) */}
          <Route path="/portal/password-change" element={<ForcedPasswordChange />} />
          <Route path="/portal/upload-documents" element={<DocumentUploadPortal />} />

          {/* User Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserOverview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/bookings"
            element={
              <ProtectedRoute>
                <UserBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/apply"
            element={
              <ProtectedRoute>
                <UserApply />
              </ProtectedRoute>
            }
          />
          <Route
            path="/submit-testimonial"
            element={
              <ProtectedRoute>
                <UserTestimonials />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/testimonials"
            element={
              <ProtectedRoute>
                <UserTestimonials />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <AdminOverview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/packages"
            element={
              <ProtectedRoute requireAdmin>
                <AdminPackages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/hotels"
            element={
              <ProtectedRoute requireAdmin>
                <AdminHotels />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <ProtectedRoute requireAdmin>
                <AdminBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/testimonials"
            element={
              <ProtectedRoute requireAdmin>
                <AdminTestimonials />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/documents"
            element={
              <ProtectedRoute requireAdmin>
                <AdminDocumentReview />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
