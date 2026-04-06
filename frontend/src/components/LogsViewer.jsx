import React from "react"

import { useEffect, useRef } from "react";
import { Terminal } from "lucide-react";

export default function LogsViewer({ logs, isBuilding }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="logs-card glass-card">
      <div className="logs-header">
        <div className="logs-title">
          <Terminal size={14} strokeWidth={2} />
          Build Logs
        </div>
        <div className="logs-meta">
          {isBuilding ? (
            <span className="logs-live">
              <span className="live-dot" />
              Live
            </span>
          ) : (
            <span className="logs-done">{logs.length} lines</span>
          )}
        </div>
      </div>

      <div className="logs-body">
        <div className="logs-inner">
          {logs.length === 0 && isBuilding && (
            <div className="logs-skeleton">
              <div className="skel-line w-60" />
              <div className="skel-line w-80" />
              <div className="skel-line w-40" />
            </div>
          )}
          {logs.map((line, i) => {
            const isSuccess = line.includes("✓");
            const isStep = line.includes(">");
            return (
              <div
                key={i}
                className={`log-line ${isSuccess ? "log-success" : ""} ${isStep ? "log-step" : ""}`}
              >
                <span className="log-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="log-text">{line}</span>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}
