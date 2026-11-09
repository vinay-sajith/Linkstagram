"use client";

import { useState } from "react";

export default function AddResourcePage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

  const [url, setUrl] = useState("");

async function handleSubmit(event) {
  event.preventDefault();

  setLoading(true);
  setError("");
  setSuccess("");

  try {
    const response = await fetch("/api/resource/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: url,
      }),
    });

    const data = await response.json();
  
    if (!response.ok) {
      setError(data.error || data.detail || "Failed to save resource");
      return;
    }

    setSuccess("Resource saved and organised successfully!");
    setUrl("");

  } catch (error) {
    setError("Unable to connect to the server.");
  } finally {
    setLoading(false);
  }
}

  return (
    <main>
      

     <form onSubmit={handleSubmit}>
  <input
    type="url"
    value={url}
    onChange={(event) => setUrl(event.target.value)}
    required
  />

  <button
    type="submit"
    disabled={loading || !url.trim()}
  >
    {loading ? "Processing..." : "ADD"}
  </button>
</form>


    </main>
  );
}