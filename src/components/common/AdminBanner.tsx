import { useState } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { isAdmin } from "@/lib/roles";

export function AdminBanner() {
  const { user } = useUser();
  const clerk = useClerk();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Check if the user is admin based on email or metadata
  const isAdminEmail =
    user?.primaryEmailAddress?.emailAddress === "nicholas.f@mikano-intl.com";
  const hasAdminRole = isAdmin(user); // Use the consistent isAdmin function

  const handleSetAdminRole = async () => {
    if (!user || !isAdminEmail) return;

    setIsLoading(true);
    try {
      await user.update({
        unsafeMetadata: { role: "admin" },
      });
      toast({
        title: "Admin role assigned",
        description: "Your admin privileges have been activated.",
        variant: "default",
      });

      // Force a page reload to update the UI
      window.location.reload();
    } catch (error) {
      console.error("Failed to update user metadata:", error);
      toast({
        title: "Error assigning admin role",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (hasAdminRole) {
    return (
      <div className="mb-4 p-4 bg-primary/10 border border-primary/20 rounded-md flex items-center">
        <Shield className="w-5 h-5 text-primary mr-2" />
        <p className="font-medium text-primary flex-1">
          Admin Mode - You have full access to the application
        </p>
        <CheckCircle className="w-5 h-5 text-primary" />
      </div>
    );
  }

  if (isAdminEmail && !hasAdminRole) {
    return (
      <div className="mb-4 p-4 bg-orange-100 border border-orange-200 rounded-md flex items-center">
        <Shield className="w-5 h-5 text-orange-500 mr-2" />
        <p className="font-medium text-orange-700 flex-1">
          Your email has admin privileges, but the role is not activated
        </p>
        <Button size="sm" onClick={handleSetAdminRole} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Setting up...
            </>
          ) : (
            "Activate Admin"
          )}
        </Button>
      </div>
    );
  }

  return null;
}
