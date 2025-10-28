"use client";
import { Button } from "@/components/ui/button";

interface DownloadButtonProps {
  syncedSrt: string | null;
}

export default function DownloadButton({ syncedSrt }: DownloadButtonProps) {
  const handleDownload = () => {
    if (!syncedSrt) {
      alert("No synced subtitle to download.");
      return;
    }

    const blob = new Blob([syncedSrt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "synced.srt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={!syncedSrt}
      variant="secondary"
    >
      Download Fixed Subtitle
    </Button>
  );
}
