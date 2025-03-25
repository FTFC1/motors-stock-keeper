import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { UserButton, SignedIn, SignedOut } from "@clerk/clerk-react";
import { ThemeToggle } from "@/components/common/ThemeToggle";

export function Header() {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between border-b p-4">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold" onClick={() => navigate("/")}>
          RT Inventory
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />

        <SignedIn>
          <UserButton
            afterSignOutUrl="/login"
            appearance={{
              elements: {
                userButtonAvatarBox: "w-9 h-9",
              },
            }}
          />
        </SignedIn>

        <SignedOut>
          <Button
            variant="ghost"
            onClick={() => navigate("/login")}
            className="text-sm"
          >
            Sign In
          </Button>
          <Button onClick={() => navigate("/signup")} className="text-sm">
            Sign Up
          </Button>
        </SignedOut>
      </div>
    </header>
  );
}
