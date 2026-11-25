"use client";
import { FileUploaderRegular } from "@uploadcare/react-uploader/next";
import "@uploadcare/react-uploader/core.css";

interface ImageUploaderProps {
  onUpload: (url: string) => void;
}

export default function ImageUploader({ onUpload }: ImageUploaderProps) {
  return (
    <FileUploaderRegular
      pubkey={process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY!}
      multiple={false}
      onFileUploadSuccess={(file) => {
        onUpload(file.cdnUrl);
      }}
    />
  );
}
