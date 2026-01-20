"use client";
import { useState } from "react";
import Hero from "@/app/components/Hero";
import FileUpload from "@/app/components/FileUpload";
import PreviewPanel from "@/app/components/PreviewPanel";
import SyncButton from "@/app/components/SyncButton";
import DownloadButton from "@/app/components/DownloadButton";
import Footer from "@/app/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const [referenceSrt, setReferenceSrt] = useState<File | null>(null);
  const [targetSrt, setTargetSrt] = useState<File | null>(null);
  const [syncedSrt, setSyncedSrt] = useState<string | null>(null);

  return (
    <main className="container mx-auto p-4">
      <Hero />
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Reference Subtitle</CardTitle>
          </CardHeader>
          <CardContent>
            <FileUpload onFileChange={setReferenceSrt} title="Reference Subtitle" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Target Subtitle</CardTitle>
          </CardHeader>
          <CardContent>
            <FileUpload onFileChange={setTargetSrt} title="Target Subtitle" />
          </CardContent>
        </Card>
      </div>
      <PreviewPanel referenceSrt={referenceSrt} targetSrt={targetSrt} />
      <div className="flex justify-center gap-4 mt-8">
        <SyncButton
          referenceSrt={referenceSrt}
          targetSrt={targetSrt}
          onSyncComplete={setSyncedSrt}
        />
        <DownloadButton syncedSrt={syncedSrt} />
      </div>
      <Footer />
    </main>
  );
}
