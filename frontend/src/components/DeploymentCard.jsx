import React from "react"

import { useState } from "react";
import { ExternalLink, Copy, Check, PartyPopper, Globe } from "lucide-react";

export default function DeploymentCard({ slug, onReset }) {
  const [copied, setCopied] = useState(false);
  const url = `http://localhost:8000/${slug}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const el = document.createElement("textarea");
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="deploy-result glass-card success-glow">
      <div className="result-top">
        <div className="result-icon">
          <PartyPopper size={20} strokeWidth={1.8} />
        </div>
        <div>
          <h3 className="result-title">Deployment Successful</h3>
          <p className="result-sub">Your project is live and accessible worldwide.</p>
        </div>
      </div>

      <div className="url-row">
        <Globe size={14} className="url-globe" />
        <span className="url-text">{url}</span>
        <div className="url-actions">
          <button
            className={`icon-btn copy-btn ${copied ? "copied" : ""}`}
            onClick={handleCopy}
            title="Copy URL"
          >
            {copied ? <Check size={14} strokeWidth={2.5} /> : <Copy size={14} />}
          </button>
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="icon-btn visit-btn"
            title="Visit site"
          >
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      <div className="result-meta">
        <div className="meta-item">
          <span className="meta-label">Status</span>
          <span className="meta-val online">● Online</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Region</span>
          <span className="meta-val">Global Edge</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Build</span>
          <span className="meta-val">{slug.slice(-5).toUpperCase()}</span>
        </div>
      </div>

      <button className="reset-btn" onClick={onReset}>
        Deploy another project
      </button>
    </div>
  );
}
