import { useEffect } from "react";
import { SignIn } from "@clerk/clerk-react";
import { PageLayout } from "@/components/common/PageLayout";

const Login = () => {
  useEffect(() => {
    console.log("Login page mounted");
    document.title = "Login | RT Inventory";
  }, []);

  return (
    <PageLayout requireAuth={false} title="Login">
      <div className="flex min-h-full items-center justify-center py-12">
        <SignIn
          appearance={{
            elements: {
              rootBox: "mx-auto w-full max-w-md",
              card: "shadow-none",
              formButtonPrimary: "bg-primary hover:bg-primary/90",
            },
          }}
          path="/login"
          routing="path"
          signUpUrl="/signup"
          afterSignInUrl="/dashboard"
        />
      </div>
    </PageLayout>
  );
};

export default Login;
