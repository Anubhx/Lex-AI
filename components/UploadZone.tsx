"use client";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";

export default function UploadZone() {
  const [status, setStatus] = useState<"idle" | "uploading" | "analyzing" | "error">("idle");
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const router = useRouter();

  const processFile = async (file: File) => {
    setFileName(file.name);
    setStatus("uploading");
    setError("");

    try {
      // Upload and parse PDF
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) {
        setError(uploadData.error || "Upload failed.");
        setStatus("error");
        return;
      }

      setStatus("analyzing");

      // Run AI analysis
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

  const statusMessages = {
    uploading: "Reading your contract...",
    analyzing: "AI is analyzing clauses and risks... (30-60 seconds)",
    error: "",
    idle: "",
  };

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl px-6 py-16 text-center cursor-pointer transition-all duration-200
          ${isDragActive ? "border-indigo-500 bg-indigo-900/20" : "border-slate-600 hover:border-indigo-500 hover:bg-slate-800/60"}
          ${status === "uploading" || status === "analyzing" ? "cursor-not-allowed opacity-70" : ""}
        `}
      >
        <input {...getInputProps()} />
        {status === "idle" || status === "error" ? (
          <>
            <div className="text-5xl mb-4">⚖️</div>
            <p className="text-white font-semibold text-lg mb-2">
              {isDragActive ? "Drop your contract here" : "Drag & drop your contract PDF"}
            </p>
            <p className="text-slate-500 text-sm">or click to browse — PDF files only, max 10MB</p>
          </>
        ) : (
          <>
            <div className="flex items-center justify-center mb-4">
              <svg className="animate-spin h-10 w-10 text-indigo-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            </div>
            <p className="text-indigo-300 font-semibold text-lg">{statusMessages[status]}</p>
            {fileName && <p className="text-slate-500 text-sm mt-2">{fileName}</p>}
          </>
        )}
      </div>
      {status === "error" && error && (
        <p className="mt-3 text-red-400 text-sm bg-red-900/20 border border-red-800 rounded-lg px-4 py-2">
          {error}
        </p>
      )}
    </div>
  );
}