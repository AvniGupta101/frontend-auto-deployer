import React from "react"

import { Zap } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="nav-logo">
          <div className="logo-icon">
            <Zap size={16} strokeWidth={2.5} />
          </div>
          <span className="logo-text">DeployX</span>
        </div>
        <div className="nav-links">
          <a href="#" className="nav-link">Docs</a>
          <a href="#" className="nav-link">Changelog</a>
          <button className="nav-btn">Sign in</button>
        </div>
      </div>
    </nav>
  );
}
