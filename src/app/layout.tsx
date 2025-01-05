

import ChangeMode from "@/components/DarkLightMode";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { SnackbarProvider } from "notistack";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Серверная логика получения локали и сообщений
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        style={{
          margin: "0",
          padding: "0",
          minHeight: "100vh",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "0",
            marginLeft: "60px",
            marginTop: "10px",
          }}
        >
          <ChangeMode />
        </div>
        <SnackbarProvider
          maxSnack={3}
          autoHideDuration={3000}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          {children}
        </SnackbarProvider>
      </body>
    </html>
  );
}
