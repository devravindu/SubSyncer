"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import srtParser2 from "srt-parser-2";

interface PreviewPanelProps {
  referenceSrt: File | null;
  targetSrt: File | null;
}

interface SrtSubtitle {
  id: string;
  startTime: string;
  endTime: string;
  text: string;
}

const PreviewContent = ({ file }: { file: File | null }) => {
  const [subs, setSubs] = useState<SrtSubtitle[]>([]);

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const parser = new srtParser2();
        setSubs(parser.fromSrt(text));
      };
      reader.readAsText(file);
    } else {
        setSubs([]);
    }
  }, [file]);

  if (!file) {
    return (
      <CardContent className="h-64 flex items-center justify-center text-muted-foreground italic font-mono">
        No file selected
      </CardContent>
    );
  }

  return (
    <CardContent className="p-0">
      <div className="h-64 overflow-y-auto border border-primary/20 rounded-none m-4 bg-black/40 custom-scrollbar">
        <table className="w-full text-sm text-left font-mono">
          <thead className="text-xs text-primary uppercase bg-primary/10 sticky top-0 backdrop-blur-sm">
            <tr>
              <th className="px-4 py-2 w-16">#</th>
              <th className="px-4 py-2 w-32">Time</th>
              <th className="px-4 py-2">Text</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary/10">
            {subs.length === 0 ? (
                 <tr>
                    <td colSpan={3} className="text-center py-4 text-muted-foreground">
                        Parsing subtitles... or empty file.
                    </td>
                </tr>
            ) : (
                subs.slice(0, 100).map((sub) => (
                    <tr key={sub.id} className="hover:bg-primary/5 transition-colors border-b border-primary/10">
                        <td className="px-4 py-2 font-medium text-primary/70">{sub.id}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-xs text-muted-foreground">
                            <div className="text-primary/60">{sub.startTime}</div>
                            <div className="text-primary/60">{sub.endTime}</div>
                        </td>
                        <td className="px-4 py-2 text-foreground/90">{sub.text}</td>
                    </tr>
                ))
            )}
            {subs.length > 100 && (
                <tr>
                    <td colSpan={3} className="text-center py-2 text-xs text-muted-foreground">
                        ... {subs.length - 100} more lines hidden ...
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
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
