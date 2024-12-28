"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from 'cookies-next'; // Assuming you're using 'cookies-next' for cookie handling

interface ProtectedRouteProps {
  children: React.ReactNode; 
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter(); 

  useEffect(() => {
    const cookie = getCookie('_CTA');
    if (!cookie) {
      router.push('/login'); // Redirect to a login or another page if the _CTA cookie is not present
    }
  }, [router]);

  return <>{children}</>;
};

export default ProtectedRoute;
