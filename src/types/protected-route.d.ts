declare module './components/common/ProtectedRoute' {
  interface ProtectedRouteProps {
    children: React.ReactNode;
  }
  
  const ProtectedRoute: React.FC<ProtectedRouteProps>;
  export default ProtectedRoute;
} 