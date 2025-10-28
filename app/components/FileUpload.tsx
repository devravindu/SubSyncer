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
    <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
      <Upload className="mx-auto h-12 w-12 text-gray-400" />
      <p className="mt-1 text-sm text-gray-600">
        {fileName ? fileName : "Drag and drop or"}
      </p>
      <Button variant="outline" asChild>
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
  );
}
