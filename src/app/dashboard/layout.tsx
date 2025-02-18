"use client";
import React, { useEffect, useState } from "react";
import Footer from "../../components/footer";
import SideBar from "../../components/sidebar";
import { useRouter } from "next/navigation";
import ProtectedRole from "./ProtectRole";
import { GlobalModalProvider } from "../providers/GlobalModalProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);5
  const footerPosition = isSideBarOpen ? "230px" : "0";
  const footerIndex = isSideBarOpen ? "0" : "9999";
  const router = useRouter();

  useEffect(() => {
    // Перевірка сесії або токену
    const token = sessionStorage.getItem('AuthToken');
    if (!token) {
      // Якщо токен відсутній, перенаправляємо на сторінку входу
      router.push('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  // Якщо не авторизований, не рендеримо дочірні компоненти
  if (!isAuthenticated) {
    return null; // Можна також показати спінер чи повідомлення про завантаження
  }

  return (
    <>
      <SideBar setIsSideBarOpen={setIsSideBarOpen} />
      <div style={{ display: "flex", marginLeft: '57px' }}>
        <div
          style={{
            flex: 1,
            left: isSideBarOpen ? "230px" : "0",
            transition: "left 5.3s ease-in 3s",
            transitionDelay: "5s",
          }}
        >
          <ProtectedRole>
            <GlobalModalProvider>
                   {children}
                 </GlobalModalProvider>
          </ProtectedRole>
          <Footer   />
        </div>
      </div>
    </>
  );
}
