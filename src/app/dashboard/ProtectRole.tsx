"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
// @ts-expect-error
import CryptoJS from 'crypto-js';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

// Функція для перевірки JWT
function isJWT(token: string) {
    if (typeof token !== "string") return false;

    const parts = token.split(".");
    if (parts.length !== 3) return false; // JWT повинні мати 3 частини

    try {
        // Декодуємо Header та Payload
        const header = JSON.parse(atob(parts[0]));
        const payload = JSON.parse(atob(parts[1]));

        // Перевіряємо, чи є це валідними об'єктами
        return typeof header === "object" && typeof payload === "object";
    } catch (error) {
        return false; // Якщо не вдалося декодувати або парсити JSON, це не JWT
    }
}

const ProtectedRole: React.FC<ProtectedRouteProps> = ({ children }) => {
    const router = useRouter();

    useEffect(() => {
        // Отримуємо токен і роль з sessionStorage
        const getToken = sessionStorage.getItem('AuthToken');
        const ciphertext = sessionStorage.getItem('user');

        if (!getToken || !isJWT(getToken)) {
            // Якщо токен відсутній або не є валідним JWT, редиректимо на сторінку входу
            router.push('/login');
            return;
        }

        if (ciphertext) {
            // Дешифруємо роль користувача
            const bytes = CryptoJS.AES.decrypt(ciphertext, 'secret-key');
            const getRole = bytes.toString(CryptoJS.enc.Utf8);

            if (!getRole) {
                // Якщо роль не знайдена, редиректимо на сторінку панелі
                router.push('/dashboard');
                return;
            }

            // Редирект залежно від ролі
            if (getRole === "admin") {
                router.push('/dashboard/admin');
            } else if (getRole === "superadmin") {
                router.push('/dashboard/superadmin');
            } else if (getRole === "user") {
                router.push('/dashboard/user');
            }
            //  else {
            //     // Якщо роль не відповідає жодному з випадків, редиректимо на загальну сторінку
            //     router.push('/dashboard');
            // }
        }
    }, [router]);

    return <>{children}</>;
};

export default ProtectedRole;
