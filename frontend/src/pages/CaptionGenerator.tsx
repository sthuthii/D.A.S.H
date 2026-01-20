import { useState } from "react";
import { generateCaption } from "../services/captionApi";

export default function CaptionGenerator() {
  const [content, setContent] = useState("");
  const [platform, setPlatform] = useState("instagram");
  const [tone, setTone] = useState("casual");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!content.trim()) {
      setError("Please enter some content");
      return;
    }

    setLoading(true);
    setError("");
    setCaption("");

    try {
      const result = await generateCaption({
        platform,
        tone,
        content,
      });

      setCaption(result);
    } catch (err) {
      setError("Failed to generate caption");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 max-w-3xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold text-center">
        Caption Generator
      </h2>

      <textarea
        className="w-full p-3 border rounded"
        placeholder="Enter your text prompt..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        aria-label="Caption prompt"
      />

      <div className="flex gap-4">
        <select
          className="border p-2 rounded bg-background text-foreground"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          aria-label="Select Platform"
        >
          <option value="instagram">Instagram</option>
          <option value="twitter">X (Twitter)</option>
          <option value="linkedin">LinkedIn</option>
          <option value="youtube">YouTube</option>
          <option value="whatsapp">WhatsApp</option>
        </select>

        <select
          className="border p-2 rounded bg-background text-foreground"
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          aria-label="Select Tone"
        >
          <option value="casual">Casual</option>
          <option value="formal">Formal</option>
          <option value="promotional">Promotional</option>
        </select>
      </div>

      <button
        type="button"
        onClick={handleGenerate}
        disabled={loading}
        className="px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 transition"
      >
        {loading ? "Generating..." : "Generate Caption"}
      </button>

      {error && <p className="text-red-500">{error}</p>}

      {caption && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">Generated Caption:</h3>
            <CopyButton text={caption} />
          </div>
          <textarea
            className="w-full p-3 border rounded h-40"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            aria-label="Generated Caption"
            readOnly
          />
        </div>
      )}
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="px-3 py-1 bg-secondary text-secondary-foreground rounded text-sm hover:opacity-80 transition min-w-[4rem]"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

