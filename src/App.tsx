import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import HajjPackages from "./pages/HajjPackages";
import UmrahPackages from "./pages/UmrahPackages";
import VisaAssistance from "./pages/VisaAssistance";
import SubmitTestimonial from "./pages/SubmitTestimonial";
import FAQs from "./pages/FAQs";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import NotFound from "./pages/NotFound";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminPackages from "./pages/admin/AdminPackages";
import AdminHotels from "./pages/admin/AdminHotels";
import AdminBookings from "./pages/admin/AdminBookings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/hajj-packages" element={<HajjPackages />} />
          <Route path="/umrah-packages" element={<UmrahPackages />} />
          <Route path="/visa-assistance" element={<VisaAssistance />} />
          <Route path="/submit-testimonial" element={<SubmitTestimonial />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminOverview />} />
          <Route path="/admin/packages" element={<AdminPackages />} />
          <Route path="/admin/hotels" element={<AdminHotels />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
