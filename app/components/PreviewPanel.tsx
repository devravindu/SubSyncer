"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PreviewPanelProps {
  referenceSrt: File | null;
  targetSrt: File | null;
}

const PreviewContent = ({ file }: { file: File | null }) => {
  const [content, setContent] = useState("Preview will appear here");

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setContent(e.target?.result as string);
      };
      reader.readAsText(file);
    }
  }, [file]);

  return (
    <CardContent>
      <pre className="text-sm text-gray-500 whitespace-pre-wrap h-64 overflow-y-auto">
        {content}
      </pre>
    </CardContent>
  );
};

export default function PreviewPanel({
  referenceSrt,
  targetSrt,
}: PreviewPanelProps) {
  return (
    <div className="w-full mt-8 grid md:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Reference</CardTitle>
        </CardHeader>
        <PreviewContent file={referenceSrt} />
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Target</CardTitle>
        </CardHeader>
        <PreviewContent file={targetSrt} />
      </Card>
    </div>
  );
}
