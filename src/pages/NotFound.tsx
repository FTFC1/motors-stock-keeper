import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-100"
      data-oid="goxfhnk"
    >
      <div className="text-center" data-oid="1p0dz40">
        <h1 className="text-4xl font-bold mb-4" data-oid="._2i78t">
          404
        </h1>
        <p className="text-xl text-gray-600 mb-4" data-oid="behso.0">
          Oops! Page not found
        </p>
        <a
          href="/"
          className="text-blue-500 hover:text-blue-700 underline"
          data-oid="4ybk8o6"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
