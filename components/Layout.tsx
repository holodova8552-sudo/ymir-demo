import React from "react";
import NavBar from "./NavBar";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="aot-bg" style={{ minHeight: "100vh", paddingBottom: "3rem" }}>
      <NavBar />
      <div className="container" style={{ paddingTop: "1rem" }}>
        {children}
      </div>
    </div>
  );
};

export default Layout;
