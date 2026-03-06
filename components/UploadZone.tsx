"use client";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";

export default function UploadZone() {
  const [status, setStatus] = useState<"idle" | "uploading" | "analyzing" | "error">("idle");
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const [progress, setProgress] = useState("");
  const router = useRouter();

  const processFile = async (file: File) => {
    setFileName(file.name);
    setStatus("uploading");
    setError("");
    setProgress("Reading contract...");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        setError(uploadData.error || "Upload failed.");
        setStatus("error");
        return;
      }

      setStatus("analyzing");
      setProgress("AI is analyzing clauses and risks...");

      const analyzeRes = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractId: uploadData.contractId }),
      });

      const analyzeData = await analyzeRes.json();
      if (!analyzeRes.ok) {
        setError(analyzeData.error || "Analysis failed.");
        setStatus("error");
        return;
      }

      router.push(`/analyze/${uploadData.contractId}`);
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted.length > 0) processFile(accepted[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    disabled: status === "uploading" || status === "analyzing",
  });

  const isLoading = status === "uploading" || status === "analyzing";

  return (
    <div>
      <div {...getRootProps()} style={{
        border: `1px dashed ${isDragActive ? "var(--green)" : "rgba(255,255,255,0.1)"}`,
        borderRadius: "14px",
        padding: "2.5rem 2rem",
        textAlign: "center",
        cursor: isLoading ? "not-allowed" : "pointer",
        background: isDragActive ? "var(--green-glow)" : "var(--bg-card)",
        backdropFilter: "blur(12px)",
        transition: "all 0.2s",
        opacity: isLoading ? 0.8 : 1,
      }}
        onMouseEnter={e => { if (!isLoading) e.currentTarget.style.borderColor = "var(--green-border)"; }}
        onMouseLeave={e => { if (!isLoading) e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
      >
        <input {...getInputProps()} />

        {isLoading ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              border: "2px solid var(--green-border)",
              borderTopColor: "var(--green)",
              animation: "spin 0.8s linear infinite"
            }} />
            <p style={{ color: "var(--green)", fontSize: "0.85rem", fontWeight: 500 }}>{progress}</p>
            {fileName && <p style={{ color: "var(--muted)", fontSize: "0.75rem" }}>{fileName}</p>}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
            <div style={{
              width: 44, height: 44, borderRadius: "10px",
              background: "var(--green-glow)", border: "1px solid var(--green-border)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.2rem"
            }}>⚖️</div>
            <div>
              <p style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: "0.25rem" }}>
                {isDragActive ? "Drop to analyze" : "Drop your contract here"}
              </p>
              <p style={{ color: "var(--muted)", fontSize: "0.78rem" }}>PDF only · Max 10MB · Free to analyze</p>
            </div>
            <div style={{
              marginTop: "0.5rem",
              background: "var(--green)", color: "#000",
              padding: "0.5rem 1.5rem", borderRadius: "6px",
              fontWeight: 700, fontSize: "0.8rem"
            }}>
              Browse files
            </div>
          </div>
        )}
      </div>

      {status === "error" && error && (
        <div style={{
          marginTop: "0.75rem", padding: "0.75rem 1rem",
          background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
          borderRadius: "8px", color: "#f87171", fontSize: "0.82rem"
        }}>
          {error}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}