import { SignUp } from "@clerk/clerk-react";
import { PageLayout } from "@/components/common/PageLayout";

const Signup = () => {
  return (
    <PageLayout requireAuth={false} title="Sign Up">
      <div className="flex min-h-full items-center justify-center">
        <SignUp
          appearance={{
            elements: {
              rootBox: "mx-auto w-full max-w-md",
              card: "shadow-none",
              formButtonPrimary: "bg-primary hover:bg-primary/90",
            },
          }}
          path="/signup"
          routing="path"
          signInUrl="/login"
          afterSignUpUrl="/dashboard"
        />
      </div>
    </PageLayout>
  );
};

export default Signup;
