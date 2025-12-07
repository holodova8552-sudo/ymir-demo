import React from "react";
import NavBar from "./NavBar";
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen aot-bg bg-cover bg-center">
      <NavBar />
      <main className="container mx-auto p-4">{children}</main>
    </div>
  );
};

export default Layout;
