import { NextResponse } from 'next/server';
import * as cookie from 'cookie';

export function middleware(req: { headers: { get: (arg0: string) => any; }; }) {
//   // Отримуємо заголовок 'cookie' з HTTP-запиту
//   const cookieHeader = req.headers.get('set-cookie');
//   console.log(req);
  
//   if (cookieHeader) {
//     // Парсимо куки з заголовка
//     const cookies = cookie.parse(cookieHeader);

//     // Перевірка чи є кука _CTA
//     const authToken = cookies._CTA;
//     if (authToken) {
//       console.log('JWT токен:', authToken);
//     } else {
//       console.log('Кука _CTA не знайдена');
//     }
//   } else {
//     console.log('Куки не знайдені');
//   }

//   // Повертаємо відповідь або передаємо запит до наступного middleware
  return NextResponse.next();
}
