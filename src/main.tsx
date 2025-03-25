import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ClerkProvider } from "@clerk/clerk-react";

console.log("Application starting...");

// Get the publishable key from environment variables
const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

console.log("Clerk key available:", !!publishableKey);

// Ensure the key is available
if (!publishableKey) {
  console.error("Missing Clerk publishable key");
  throw new Error(
    "Missing Clerk publishable key. Set VITE_CLERK_PUBLISHABLE_KEY in your .env file",
  );
}

const rootElement = document.getElementById("root");
console.log("Root element found:", !!rootElement);

createRoot(rootElement!).render(
  <ClerkProvider publishableKey={publishableKey}>
    <App />
  </ClerkProvider>,
);

console.log("Render attempted...");
