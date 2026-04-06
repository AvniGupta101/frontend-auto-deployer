import React from "react"

import { Rocket } from "lucide-react";

export default function DeployButton({ onClick, loading, disabled }) {
  return (
    <button
      className={`deploy-btn ${loading ? "loading" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {loading ? (
        <>
          <span className="spinner" />
          Deploying...
        </>
      ) : (
        <>
          <Rocket size={15} strokeWidth={2} />
          Deploy
        </>
      )}
    </button>
  );
}
