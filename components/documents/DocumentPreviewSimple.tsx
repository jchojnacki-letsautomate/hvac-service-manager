
import React from "react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface DocumentPreviewSimpleProps {
  documentNumber: string;
  className?: string;
}

export function DocumentPreviewSimple({
  documentNumber,
  className,
}: DocumentPreviewSimpleProps) {
  // Determine which preview image to show based on document number
  const previewImageUrl = documentNumber.includes("FV") 
    ? "/docs/invoice-preview-1.jpg" 
    : "/docs/protocol-preview-1.jpg";

  return (
    <div className={`flex justify-center border rounded-md p-4 bg-gray-50 ${className || ""}`}>
      <ImageWithFallback
        src={previewImageUrl}
        alt={`Podgląd dokumentu ${documentNumber}`}
        width={600}
        height={800}
        className="max-w-full h-auto object-contain"
      />
    </div>
  );
}
