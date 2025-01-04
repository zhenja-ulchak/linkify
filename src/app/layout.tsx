"use client";

import ChangeMode from "@/components/DarkLightMode";
import "../globals.css";

import { SnackbarProvider } from "notistack";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
            horizontal: "right",
          }}
        >
          {children}
        </SnackbarProvider>
      </body>
    </html>
  );
}
