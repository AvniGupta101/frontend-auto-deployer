import React from "react"

import { Github } from "lucide-react";

export default function RepoInput({ value, onChange, disabled }) {
  return (
    <div className="repo-input-wrapper">
      <Github className="input-icon" size={16} />
      <input
        type="text"
        className="repo-input"
        placeholder="https://github.com/username/repository"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        spellCheck={false}
      />
    </div>
  );
}
