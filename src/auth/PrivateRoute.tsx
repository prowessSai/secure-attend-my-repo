import type { JSX } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "./AuthProvider";

export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
}
