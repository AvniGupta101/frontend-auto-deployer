import React from "react"

import { Clock, Hammer, CheckCircle2 } from "lucide-react";

const STATUS_MAP = {
  queued: {
    label: "Queued",
    icon: Clock,
    className: "badge-queued",
  },
  building: {
    label: "Building",
    icon: Hammer,
    className: "badge-building",
  },
  deployed: {
    label: "Deployed",
    icon: CheckCircle2,
    className: "badge-deployed",
  },
};

export default function StatusBadge({ status }) {
  const config = STATUS_MAP[status];
  if (!config) return null;
  const Icon = config.icon;
  return (
    <span className={`status-badge ${config.className}`}>
      {status === "building" && <span className="pulse-dot" />}
      <Icon size={12} strokeWidth={2.5} />
      {config.label}
    </span>
  );
}
