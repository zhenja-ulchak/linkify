// app/layout.tsx
'use client'

import { NextIntlClientProvider } from 'next-intl';
import { useEffect, useState } from 'react';
import enMessages from '../../messages/en.json';
import ukMessages from '../../messages/ua.json';
import ChangeMode from "@/components/DarkLightMode";
import { SnackbarProvider } from "notistack";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<string>('en');
  const [messages, setMessages] = useState<any>(enMessages);

  useEffect(() => {
    // Логіка для зміни мови
    const savedLocale = localStorage.getItem('locale') || 'en';
    setLocale(savedLocale);
    if (savedLocale === 'uk') {
      setMessages(ukMessages);
    } else {
      setMessages(enMessages);
    }
  }, []);

  return (
    <html lang={locale}>
      <body style={{ margin: "0", padding: "0", minHeight: "100vh" }}>
        <div style={{ position: "absolute", left: "0", marginLeft: "60px", marginTop: "10px" }}>
          <ChangeMode />
        </div>
        <NextIntlClientProvider locale={locale}  messages={messages}>
          <SnackbarProvider maxSnack={3} autoHideDuration={3000} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
            {children}
          </SnackbarProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
