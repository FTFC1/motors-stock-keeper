import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient} data-oid="hrh_mm-">
    <TooltipProvider data-oid="7vagj.:">
      <AuthProvider data-oid="2r8uyi2">
        <Toaster data-oid="3p2ehhz" />
        <Sonner data-oid="m3h_29i" />
        <BrowserRouter data-oid="0q1.8oz">
          <Routes data-oid="vo5hd3f">
            <Route
              path="/"
              element={<Index data-oid="of-o1aq" />}
              data-oid="iehqapk"
            />

            <Route
              path="/login"
              element={<Login data-oid="ymzazgs" />}
              data-oid="kzh1xew"
            />

            <Route
              path="/dashboard"
              element={<Dashboard data-oid=".4.kqqt" />}
              data-oid="puykc1e"
            />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route
              path="*"
              element={<NotFound data-oid="szccozr" />}
              data-oid="gcpp.64"
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
