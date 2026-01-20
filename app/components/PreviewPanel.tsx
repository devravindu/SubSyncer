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
      <CardContent className="h-64 flex items-center justify-center text-gray-400 italic">
        No file selected
      </CardContent>
    );
  }

  return (
    <CardContent className="p-0">
      <div className="h-64 overflow-y-auto border rounded-md m-4">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0">
            <tr>
              <th className="px-4 py-2 w-16">#</th>
              <th className="px-4 py-2 w-32">Time</th>
              <th className="px-4 py-2">Text</th>
            </tr>
          </thead>
          <tbody>
            {subs.length === 0 ? (
                 <tr>
                    <td colSpan={3} className="text-center py-4 text-gray-500">
                        Parsing subtitles... or empty file.
                    </td>
                </tr>
            ) : (
                subs.slice(0, 100).map((sub) => (
                    <tr key={sub.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2 font-medium text-gray-500">{sub.id}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">
                            <div>{sub.startTime}</div>
                            <div>{sub.endTime}</div>
                        </td>
                        <td className="px-4 py-2">{sub.text}</td>
                    </tr>
                ))
            )}
            {subs.length > 100 && (
                <tr>
                    <td colSpan={3} className="text-center py-2 text-xs text-gray-400">
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
