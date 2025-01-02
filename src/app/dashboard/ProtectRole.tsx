"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
// @ts-expect-error
import CryptoJS from 'crypto-js';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRole: React.FC<ProtectedRouteProps> = ({ children }) => {
    const router = useRouter();
    const getRole = sessionStorage.getItem('user');

    useEffect(() => {
        const ciphertext = sessionStorage.getItem('user');
        if (ciphertext) {
            const bytes = CryptoJS.AES.decrypt(ciphertext, 'secret-key');
            const getRole = bytes.toString(CryptoJS.enc.Utf8);
            if (!getRole) {
                // Якщо роль не знайдена, можна редиректити на загальну сторінку або показати помилку
                router.push('/dashboard'); // Редирект на сторінку з панелями
                return;
            }

            // Логіка редиректу в залежності від ролі
            if (getRole === "admin") {
                router.push('/dashboard/admin'); // Редирект на адмін панель
            } else if (getRole === "super_admin") {
                router.push('/dashboard/superadmin'); // Редирект на супер адмін панель
            } else if (getRole === "user") {
                router.push('/dashboard/user'); // Редирект на панель користувача
            }

        }




    }, [router]);

    return <>{children}</>;
};

export default ProtectedRole;
