"use client";
import { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  title: string;
  onFileChange: (file: File) => void;
}

export default function FileUpload({ title, onFileChange }: FileUploadProps) {
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setFileName(file.name);
      onFileChange(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center border border-dashed border-primary/30 bg-background/20 rounded-none p-8 text-center hover:border-primary hover:bg-primary/5 hover:shadow-[0_0_15px_rgba(0,255,255,0.1)] transition-all duration-300">
      <Upload className="mx-auto h-12 w-12 text-primary animate-pulse" />
      <p className="mt-4 text-sm text-muted-foreground font-mono">
        {fileName ? (
          <span className="text-primary font-bold">{fileName}</span>
        ) : (
          "Drag and drop or"
        )}
      </p>
      <div className="mt-4">
        <Button variant="secondary" asChild className="uppercase tracking-widest">
          <label htmlFor={title} className="cursor-pointer">
            Click to upload
            <input
              id={title}
              type="file"
              className="sr-only"
              onChange={handleFileChange}
              accept=".srt"
            />
          </label>
        </Button>
      </div>
    </div>
  );
}
