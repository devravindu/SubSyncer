"use client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface SyncButtonProps {
  referenceSrt: File | null;
  targetSrt: File | null;
  onSyncComplete: (syncedSrt: string) => void;
}

export default function SyncButton({
  referenceSrt,
  targetSrt,
  onSyncComplete,
}: SyncButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleSync = async () => {
    if (!referenceSrt || !targetSrt) {
      toast.error("Please upload both reference and target SRT files.");
      return;
    }

    setLoading(true);

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
        toast.success("Subtitles synced successfully!");
      } else {
        toast.error("Failed to sync subtitles.");
      }
    } catch (error) {
      console.error("Error syncing subtitles:", error);
      toast.error("An error occurred while syncing subtitles.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSync}
      disabled={!referenceSrt || !targetSrt || loading}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {loading ? "Syncing..." : "Sync Now"}
    </Button>
  );
}
