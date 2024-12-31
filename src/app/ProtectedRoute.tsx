"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";



interface ProtectedRouteProps {
  children: React.ReactNode;
}

function isJWT(token: string) {
  if (typeof token !== "string") return false;

  const parts = token.split(".");
  if (parts.length !== 3) return false; // JWT muss 3 Teile haben

  try {
    // Decodiere Header und Payload
    const header = JSON.parse(atob(parts[0]));
    const payload = JSON.parse(atob(parts[1]));

    // Optional: Überprüfen, ob Header und Payload gültige Objekte sind
    return typeof header === "object" && typeof payload === "object";
  } catch (error) {
    return false; // Falls Decodierung oder JSON-Parsing fehlschlägt, ist es kein JWT
  }
}


const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    // Отримуємо токен з sessionStorage
    const getToken: any = sessionStorage.getItem('AuthToken');

    if ( !isJWT(getToken)) {

      router.push('/login'); // Якщо токен відсутній, редирект на сторінку входу
      return;
    }


  }, [router]);

  return <>{children}</>;
};

export default ProtectedRoute;
