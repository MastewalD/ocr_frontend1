"use client";

import { useState, useRef } from "react";
import { useMutation } from "@apollo/client";
import { UPLOAD_RECEIPT_MUTATION } from "@/lib/graphql/mutations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Upload,
  Sparkles,
  Copy,
  ArrowRight,
  Loader2,
  Check,
} from "lucide-react";
import { UploadReceiptMutationData } from "@/types/types";
import Image from "next/image";

const formatReceiptData = (data: UploadReceiptMutationData): string => {
  if (!data?.uploadReceipt?.receipt) return "Could not parse receipt data.";

  const { storeName, dateOfPurchase, totalAmount, items } =
    data.uploadReceipt.receipt;

  let receiptText = `Store: ${storeName || "N/A"}\n`;
  if (dateOfPurchase) {
    receiptText += `Date: ${new Date(
      parseInt(dateOfPurchase, 10)
    ).toLocaleDateString()}\n`;
  }
  receiptText += `Total: $${totalAmount?.toFixed(2) || "0.00"}\n\n`;
  receiptText += `--- Items ---\n`;

  if (items && items.length > 0) {
    items.forEach((item: { name: string; price: number }) => {
      const priceString = item.price.toFixed(2);
      receiptText += `${item.name} - $${priceString}\n`;
    });
  } else {
    receiptText += "No items found.\n";
  }

  return receiptText.trim();
};

export function ReceiptScanner() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>("");
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadReceipt, { loading: isProcessing }] = useMutation(
    UPLOAD_RECEIPT_MUTATION,
    {
      onCompleted: (data) => {
        const formattedText = formatReceiptData(data);
        setExtractedText(formattedText);
        toast.success(
          data.uploadReceipt.message || "Receipt processed successfully!"
        );
      },
      onError: (error) => {
        toast.error(error.message || "Failed to process receipt.");
        setExtractedText("");
      },
    }
  );

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setExtractedText("");

        uploadReceipt({
          variables: {
            file,
          },
        });
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Please select a valid image file.");
      setImagePreview(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    e.target.files?.[0] && handleFileSelect(e.target.files[0]);
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    e.dataTransfer.files?.[0] && handleFileSelect(e.dataTransfer.files[0]);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const copyToClipboard = () => {
    if (extractedText)
      navigator.clipboard.writeText(extractedText).then(() => {
        setIsCopied(true);
        toast.success("Copied to clipboard.");
        setTimeout(() => setIsCopied(false), 2000);
      });
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <div className="text-center mb-8">
        <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-zinc-800">
          Scan Your Receipt
        </h1>
        <p className="mt-4 text-base text-zinc-600">
          Upload a receipt image and get the text in seconds.
        </p>
      </div>


      <Card className="w-full p-4 sm:p-6 bg-white/80 border-zinc-200/80 shadow-none">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="flex flex-col h-full">
            <CardHeader className="p-2">
              <CardTitle className="text-sm font-semibold text-zinc-700 flex items-center">
                <span className="w-2 h-2 bg-[#DDB787] rounded-full mr-2"></span>
                Original Receipt
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 flex-grow">
              <div
                onClick={() => !isProcessing && fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`w-full h-80 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center transition-colors
                    ${
                      isDragging
                        ? "border-[#DDB787] bg-[#F6EFE6]/50"
                        : "border-zinc-300"
                    }
                    ${
                      isProcessing
                        ? "cursor-not-allowed bg-zinc-50"
                        : "cursor-pointer hover:border-[#DDB787] hover:bg-[#FBF9F6]"
                    }
                `}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isProcessing}
                />
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Receipt preview"
                    width={400}
                    height={320}
                    className="max-h-full max-w-full object-contain rounded-lg"
                    style={{ width: "100%", height: "auto" }}
                  />
                ) : (
                  <div className="flex flex-col items-center text-zinc-500">
                    <div className="w-16 h-16 rounded-full bg-[#F6EFE6] flex items-center justify-center mb-4">
                      <Upload className="w-6 h-6 text-[#DDB787]" />
                    </div>
                    <p className="font-semibold">Drop your receipt here</p>
                    <p className="text-sm">or click to upload</p>
                    <p className="text-xs text-zinc-400 mt-2">
                      Max 5MB • JPG, PNG, GIF
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </div>

          <div className="hidden md:block absolute left-1/2 -translate-x-1/2">
            <div className="w-10 h-10 bg-[#6B4F2E] rounded-full flex items-center justify-center border border-[#EADFCC]">
              <ArrowRight className="w-5 h-5 text-[#F6EFE6]" />
            </div>
          </div>


          <div className="flex flex-col h-full">
            <CardHeader className="p-2">
              <CardTitle className="text-sm font-semibold text-zinc-700 flex items-center">
                <span className="w-2 h-2 bg-[#87A8DD] rounded-full mr-2"></span>
                Extracted Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 flex-grow">
              <div className="w-full min-h-80 border border-zinc-200 rounded-xl bg-zinc-50/50 flex flex-col">
                {isProcessing ? (
                  <div className="flex-grow flex flex-col items-center justify-center text-zinc-500">
                    <Loader2 className="w-8 h-8 animate-spin text-[#87A8DD]" />
                    <p className="mt-4 font-medium">Extracting details...</p>
                  </div>
                ) : extractedText ? (
                  <div className="flex-grow flex flex-col p-4 relative">
                    <pre className="whitespace-pre-wrap text-sm text-zinc-700 font-sans flex-grow overflow-y-auto">
                      {extractedText}
                    </pre>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={copyToClipboard}
                      className="absolute top-3 right-3 h-8 px-2 bg-white/50 hover:bg-white cursor-pointer"
                    >
                      {isCopied ? (
                        <Check className="w-4 h-4 mr-1" />
                      ) : (
                        <Copy className="w-4 h-4 mr-1" />
                      )}
                      {isCopied ? "Copied" : "Copy"}
                    </Button>
                  </div>
                ) : (
                  <div className="flex-grow flex flex-col items-center justify-center text-zinc-500 text-center p-4">
                    <div className="w-16 h-16 rounded-full bg-[#E6EFF6] flex items-center justify-center mb-4">
                      <Sparkles className="w-6 h-6 text-[#87A8DD]" />
                    </div>
                    <p className="font-semibold">Extracted details</p>
                    <p className="text-sm">
                      Your receipt details will appear here
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </div>
        </div>
      </Card>
    </div>
  );
}
