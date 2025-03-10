import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Role } from "@/types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  logout: () => {},
  isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = () => {
      const savedUser = localStorage.getItem("user");

      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error("Failed to parse stored user:", error);
          localStorage.removeItem("user");
        }
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Mock login function - in a real app, this would call an API
  const login = async (email: string, password: string) => {
    setIsLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // For demo purposes, validate email domain and create mock user
    if (!email.endsWith("@motors.com")) {
      setIsLoading(false);
      throw new Error("Only @motors.com email addresses are allowed");
    }

    // Check if password is at least 6 characters
    if (password.length < 6) {
      setIsLoading(false);
      throw new Error("Password must be at least 6 characters");
    }

    // For demo, admin@motors.com gets admin role, all others get sales role
    const role: Role = email === "admin@motors.com" ? "admin" : "sales";

    const user: User = {
      id: "1",
      email,
      name: email.split("@")[0],
      role,
    };

    // Save user to localStorage (in real app, would use tokens)
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
    setIsLoading(false);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
      data-oid="hr.:5xv"
    >
      {children}
    </AuthContext.Provider>
  );
};
