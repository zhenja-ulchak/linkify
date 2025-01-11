'use client';

import { NextIntlClientProvider } from 'next-intl';
import { useEffect, useState } from 'react';
import enMessages from '../../messages/en.json';
import ukMessages from '../../messages/ua.json';
import deMessages from '../../messages/de.json';
import ruMessages from '../../messages/ru.json';
import zhcnMessages from '../../messages/zh-CN.json';
import ChangeMode from '@/components/DarkLightMode';
import { SnackbarProvider } from 'notistack';

export default function RootLayout({ children }: { children: React.ReactNode }) {

  const [locale, setLocale] = useState<string | undefined>();
  const [messages, setMessages] = useState<any>(enMessages);
  

  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') || 'en';
  
    setLocale(savedLocale);

    // Логика для загрузки сообщений в зависимости от локали
    switch (savedLocale) {
      case 'en':
        setMessages(enMessages);
        break;
      case 'de':
        setMessages(deMessages);
        break;
      case 'ua':
        setMessages(ukMessages);
        break;
      case 'ru':
        setMessages(ruMessages);
        break;
      case 'zh-CN':
        setMessages(zhcnMessages);
        break;
      default:
        setMessages(enMessages);
        break;
    }



   
 

  
  const timer = setTimeout(() => {
     localStorage.removeItem('locale');// Очищаємо sessionStorage після завершення сесії
  }, 3600000);

  // Очищуємо таймер при розмонтуванні компонента
  return () => clearTimeout(timer);
  }, []);

  // Detect browser's time zone or use a default like UTC
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Berlin';

  return (
    <html lang={locale || "en"}>
      <body style={{ margin: '0', padding: '0', minHeight: '100vh' }}>
        <div style={{ }}>
          <ChangeMode />
        </div>
        <NextIntlClientProvider locale={locale || "en"} messages={messages} timeZone={timeZone}>
          <SnackbarProvider
            maxSnack={3}
            autoHideDuration={3000}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            {children}
          </SnackbarProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
