"use client";
import { Button } from "@/components/ui/button";

interface SyncButtonProps {
  referenceSrt: File | null;
  targetSrt: File | null;
  onSyncComplete: (syncedSrt: string) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export default function SyncButton({
  referenceSrt,
  targetSrt,
  onSyncComplete,
  setIsLoading,
}: SyncButtonProps) {
  const handleSync = async () => {
    if (!referenceSrt || !targetSrt) {
      alert("Please upload both reference and target SRT files.");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("referenceSrt", referenceSrt);
    formData.append("targetSrt", targetSrt);

    try {
      const response = await fetch("/api/sync", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const syncedSrt = await response.text();
        onSyncComplete(syncedSrt);
        alert("Subtitles synced successfully!");
      } else {
        alert("Failed to sync subtitles.");
      }
    } catch (error) {
      console.error("Error syncing subtitles:", error);
      alert("An error occurred while syncing subtitles.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSync}
      disabled={!referenceSrt || !targetSrt}
    >
      Sync Now
    </Button>
  );
}
