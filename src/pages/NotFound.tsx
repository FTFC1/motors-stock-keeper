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
      data-oid="n.nsob1"
    >
      <div className="text-center" data-oid="::bc925">
        <h1 className="text-4xl font-bold mb-4" data-oid="n7ug3xo">
          404
        </h1>
        <p className="text-xl text-gray-600 mb-4" data-oid="z3xl6ap">
          Oops! Page not found
        </p>
        <a
          href="/"
          className="text-blue-500 hover:text-blue-700 underline"
          data-oid="yuuxm25"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
