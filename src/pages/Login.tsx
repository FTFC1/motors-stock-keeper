import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { PageLayout } from "@/components/common/PageLayout";
import { LoginForm } from "@/components/authentication/LoginForm";

const Login = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <PageLayout requireAuth={false} title="Login" data-oid="lzf50.5">
      <LoginForm data-oid="ghc5:jp" />
    </PageLayout>
  );
};

export default Login;
