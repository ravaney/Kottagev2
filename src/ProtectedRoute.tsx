//create a function that takes a react functional component as a child and returns a react functional component
//this function will be used to wrap the components that need to be protected

import { Navigate, useLocation } from "react-router-dom";
import { auth } from "./firebase";

//create a useeffect to check if the user is logged in and if they are on a protected route
//if they are not logged in, redirect them to the login page

export default function ProtectedRoute({ children, ...rest }: any) {
  const location = useLocation();
  if (auth.currentUser) {
    return children;
  }
  return <Navigate to="/Login" replace state={{ from: location }} />;
}
