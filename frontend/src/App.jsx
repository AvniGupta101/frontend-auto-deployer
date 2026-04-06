import React from "react"
import { io } from "socket.io-client"
import { useEffect } from "react"
import { useState, useCallback } from "react";
import Navbar from "./components/Navbar";
import RepoInput from "./components/RepoInput";
import DeployButton from "./components/DeployButton";
import StatusBadge from "./components/StatusBadge";
import LogsViewer from "./components/LogsViewer";
import DeploymentCard from "./components/DeploymentCard";


const socket = io("http://localhost:9000")
const MOCK_LOGS = [
  "[00:00:01] > Initializing deployment pipeline...",
  "[00:00:02] > Cloning repository from GitHub...",
  "[00:00:03] > Repository cloned successfully.",
  "[00:00:04] > Detecting framework: React + Vite",
  "[00:00:05] > Installing dependencies...",
  "[00:00:08] > npm install completed (312 packages)",
  "[00:00:09] > Running build command: npm run build",
  "[00:00:10] > Bundling assets...",
  "[00:00:12] > Optimizing images and static files...",
  "[00:00:14] > Build output: dist/ (2.3 MB)",
  "[00:00:15] > Uploading build artifacts...",
  "[00:00:16] > Configuring edge network...",
  "[00:00:17] > Propagating to CDN nodes...",
  "[00:00:18] > SSL certificate provisioned.",
  "[00:00:19] > DNS routing configured.",
  "[00:00:20] > Health check passed.",
  "[00:00:21] > Deployment finalized.",
  "[00:00:22] ✓ Build complete. Project is live.",
];

export default function App() {
  const [repoUrl, setRepoUrl] = useState("");
  const [status, setStatus] = useState("idle");
  const [logs, setLogs] = useState([]);
  const [slug, setSlug] = useState("");
  const [error, setError] = useState("");

 useEffect(() => {
  if (!slug) return

  const channel = `logs:${slug}`

  console.log("Subscribing to:", channel)

  socket.emit("subscribe", channel)

  socket.on("message", (msg) => {
    setLogs(prev => [...prev, msg])
  })

  return () => {
    socket.off("message")
  }
}, [slug])


  const handleDeploy = useCallback(async () => {
    if (!repoUrl.trim()) return;
    setError("");
    setStatus("queued");
    setLogs([]);
    setSlug("");

    await new Promise((r) => setTimeout(r, 800));
    setStatus("building");

    for (let i = 0; i < MOCK_LOGS.length; i++) {
      await new Promise((r) => setTimeout(r, 220 + Math.random() * 180));
      setLogs((prev) => [...prev, MOCK_LOGS[i]]);
    }

    try {
      const res = await fetch("http://localhost:9000/project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gitURL: repoUrl }),
      });
      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      setSlug(data.slug || "my-project-abc123");
    } catch {
      const fallbackSlug = repoUrl
        .split("/")
        .pop()
        ?.replace(/\.git$/, "")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-") || "my-project";
      setSlug(`${fallbackSlug}-${Math.random().toString(36).slice(2, 7)}`);
    }

    setStatus("deployed");
  }, [repoUrl]);

  const handleReset = () => {
    setStatus("idle");
    setLogs([]);
    setSlug("");
    setRepoUrl("");
    setError("");
  };

  const isDeploying = status === "queued" || status === "building";

  return (
    <div className="app-root">
      <div className="grid-bg" />
      <Navbar />

      <main className="main-content">
        <div className="hero-section">
          <div className="badge-pill">
            <span className="badge-dot" />
            Production-ready deployments
          </div>
          <h1 className="hero-title">
            Deploy your project
            <br />
            <span className="hero-accent">in seconds.</span>
          </h1>
          <p className="hero-sub">
            Connect your GitHub repo and ship to the edge instantly.
          </p>
        </div>

        <div className="deploy-card glass-card">
          <div className="card-header">
            <span className="card-title">New Deployment</span>
            {status !== "idle" && (
              <StatusBadge status={status} />
            )}
          </div>

          <div className="input-row">
            <RepoInput
              value={repoUrl}
              onChange={setRepoUrl}
              disabled={isDeploying}
            />
            <DeployButton
              onClick={handleDeploy}
              loading={isDeploying}
              disabled={!repoUrl.trim() || isDeploying || status === "deployed"}
            />
          </div>

          {error && <p className="error-msg">{error}</p>}
        </div>

        {(logs.length > 0 || isDeploying) && (
          <div className="section-fade">
            <LogsViewer logs={logs} isBuilding={status === "building"} />
          </div>
        )}

        {status === "deployed" && slug && (
          <div className="section-fade">
            <DeploymentCard slug={slug} onReset={handleReset} />
          </div>
        )}
      </main>
    </div>
  );
}
