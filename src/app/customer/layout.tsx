"use client";
import React, { useState } from "react";
import Footer from "../../components/footer";
import SideBar from "../../components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  const footerPosition = isSideBarOpen ? "230px" : "0";
  const footerIndex = isSideBarOpen ? "0" : "9999";

  return (
    <>
      <SideBar setIsSideBarOpen={setIsSideBarOpen} />
      <div style={{ display: "flex" }}>
        <div
          style={{
            flex: 1,
            left: isSideBarOpen ? "230px" : "0",
            transition: "left 5.3s ease-in 3s",
            transitionDelay: "5s",
          }}
        >
          {children}
          <Footer footerPosition={footerPosition} footerIndex={footerIndex} />
        </div>
      </div>
    </>
  );
}
