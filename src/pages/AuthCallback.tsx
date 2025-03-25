import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState(
    "Verifying your email...",
  );

  useEffect(() => {
    // Handle the OAuth callback
    const handleAuthCallback = async () => {
      try {
        // Get the URL hash and extract the access_token and refresh_token
        const hashParams = new URLSearchParams(
          window.location.hash.substring(1),
        );
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");
        const type = hashParams.get("type");

        if (!accessToken && !refreshToken) {
          // Try to get the session directly if no tokens in URL
          const { data, error } = await supabase.auth.getSession();

          if (error) {
            console.error("Error getting session:", error);
            setVerificationStatus("Verification failed. Redirecting...");
            setTimeout(() => {
              navigate(
                "/login?error=Unable to verify email. Please try again.",
              );
            }, 2000);
            return;
          }

          if (!data.session) {
            setVerificationStatus("No active session found. Redirecting...");
            setTimeout(() => {
              navigate(
                "/login?error=Email verification failed. Please try again or contact support.",
              );
            }, 2000);
            return;
          }
        }

        // If we have tokens in the URL, set the session
        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.error("Error setting session:", error);
            setVerificationStatus("Verification failed. Redirecting...");
            setTimeout(() => {
              navigate("/login?error=Unable to verify email: " + error.message);
            }, 2000);
            return;
          }
        }

        // Successfully verified email
        setVerificationStatus("Email verified successfully! Redirecting...");
        setTimeout(() => {
          navigate(
            "/login?message=Email verified successfully. You can now log in.",
          );
        }, 2000);
      } catch (err) {
        console.error("Error during auth callback:", err);
        setVerificationStatus("An error occurred. Redirecting...");
        setTimeout(() => {
          navigate(
            "/login?error=An unexpected error occurred during verification.",
          );
        }, 2000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">{verificationStatus}</h2>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      </div>
    </div>
  );
}
