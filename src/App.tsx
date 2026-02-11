import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { useCartSync } from "@/hooks/useCartSync";
import Index from "./pages/Index";
import ProductDetail from "./pages/ProductDetail";
import Collections from "./pages/Collections";
import CollectionDetail from "./pages/CollectionDetail";
import Brands from "./pages/Brands";
import Shop from "./pages/Shop";

// Lazy load less critical pages
const BrandVichy = lazy(() => import("./pages/BrandVichy"));
const BestSellers = lazy(() => import("./pages/BestSellers"));
const Offers = lazy(() => import("./pages/Offers"));
const Contact = lazy(() => import("./pages/Contact"));
const SkinConcerns = lazy(() => import("./pages/SkinConcerns"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Auth = lazy(() => import("./pages/Auth"));
const Account = lazy(() => import("./pages/Account"));
const Philosophy = lazy(() => import("./pages/Philosophy"));

// Lazy load admin pages (significantly reduces initial bundle)
const BulkUpload = lazy(() => import("./pages/BulkUpload"));
const AdminOrders = lazy(() => import("./pages/AdminOrders"));
const ManageProducts = lazy(() => import("./pages/ManageProducts"));
const DriverDashboard = lazy(() => import("./pages/DriverDashboard"));
const AdminAuditLogs = lazy(() => import("./pages/AdminAuditLogs"));
const TrackOrder = lazy(() => import("./pages/TrackOrder"));

const queryClient = new QueryClient();

// Cart sync wrapper component
function CartSyncProvider({ children }: { children: React.ReactNode }) {
  useCartSync();
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <CartSyncProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner position="top-center" />
          <BrowserRouter>
            <Suspense fallback={
              <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            }>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:handle" element={<ProductDetail />} />
                <Route path="/collections" element={<Collections />} />
                <Route path="/collections/:slug" element={<CollectionDetail />} />
                <Route path="/brands" element={<Brands />} />
                <Route path="/brands/vichy" element={<BrandVichy />} />
                <Route path="/best-sellers" element={<BestSellers />} />
                <Route path="/offers" element={<Offers />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/skin-concerns" element={<SkinConcerns />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/account" element={<Account />} />
                <Route path="/philosophy" element={<Philosophy />} />
                <Route path="/admin/bulk-upload" element={<BulkUpload />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/admin/products" element={<ManageProducts />} />
                <Route path="/track-order" element={<TrackOrder />} />
                <Route path="/driver" element={<DriverDashboard />} />
                <Route path="/admin/audit-logs" element={<AdminAuditLogs />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </CartSyncProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
