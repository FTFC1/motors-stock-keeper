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
  <QueryClientProvider client={queryClient} data-oid="a0v-ln:">
    <TooltipProvider data-oid="g3iqy9r">
      <AuthProvider data-oid="s3vr8bq">
        <Toaster data-oid="s9.wpbt" />
        <Sonner data-oid="u3:leo9" />
        <BrowserRouter data-oid="-be_cg5">
          <Routes data-oid="bbu3eyi">
            <Route
              path="/"
              element={<Index data-oid="wo-wu02" />}
              data-oid="s79zvgc"
            />

            <Route
              path="/login"
              element={<Login data-oid="qygwc9i" />}
              data-oid="i4.sytn"
            />

            <Route
              path="/dashboard"
              element={<Dashboard data-oid="z3b-wh." />}
              data-oid="zn7e8fi"
            />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route
              path="*"
              element={<NotFound data-oid="7ucyd0m" />}
              data-oid="qeb7msz"
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
