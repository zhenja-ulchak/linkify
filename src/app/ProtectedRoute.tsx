"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    // Отримуємо токен з sessionStorage
    const getToken = sessionStorage.getItem('AuthToken');

    if (!getToken) {
      router.push('/login'); // Якщо токен відсутній, редирект на сторінку входу
      return;
    }


  }, [router]);

  return <>{children}</>;
};

export default ProtectedRoute;
