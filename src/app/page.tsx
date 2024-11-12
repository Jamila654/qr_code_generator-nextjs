"use client";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Share2 } from "lucide-react";

export default function Home() {
  const [inputValue, setinputValue] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [error, setError] = useState("");
  const [barcode, setBarcode] = useState<string | null>(null);

  const handleShareBtn = async () => {
    if (barcode) {
      const blob = await (
        await fetch(`data:image/png;base64,${barcode}`)
      ).blob();
      const file = new File([blob], "qr-code.png", { type: "image/png" });
      const shareData = {
        title: "QR Code",
        files: [file],
      };
      if (navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        console.log("Sharing is not supported");
      }
    }
  };

  const handleGenerateBtn = async () => {
    setisLoading(true);
    setError("");
    setBarcode(null);
    try {
      const res = await fetch(
        `https://api.api-ninjas.com/v1/qrcode?format=png&data=${inputValue}`,
        {
          headers: {
            "X-Api-Key": "lKtqOcitXKlPdf5kvf1ysg==AguhIHwYblypgdyF",
          },
        }
      );
      if (!res.ok) {
        setError("Enter a valid URL");
      }
      const base64Image = await res.text();
      setBarcode(base64Image);
    } catch (error) {
      setError("Error generating barcode");
    } finally {
      setisLoading(false);
    }
  };

  return (
    <div className="main bg-[#12102D] min-h-screen flex items-center justify-center w-full font-[family-name:var(--font-geist-sans)] relative">
      <div
        className="absolute inset-0 bg-center opacity-[0.04]"
        style={{ backgroundImage: "url('/bg.jpeg')" }}
      ></div>
      <div className="card relative">
        <Card className="bg-white rounded-2xl w-[400px]">
          <CardHeader>
            <CardTitle>QR Code Generator</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center gap-4">
            <div className="input w-full">
              <h1>Enter your website URL</h1>
              <Input
                placeholder="website URL"
                className="rounded-xl"
                value={inputValue}
                onChange={(e) => {
                  setinputValue(e.target.value);
                }}
              />
            </div>
            <div className="barcode">
              {error && (
                <div className="error w-full text-center text-red-500 font-bold">
                  {error}
                </div>
              )}
              {barcode && (
                <div className="display">
                  <img
                    src={`data:image/png;base64,${barcode}`} // Set base64 string as source
                    alt="QR Code"
                    width={200}
                    height={200}
                    className="rounded-lg"
                  />
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="w-full flex items-center justify-center">
            <Button
              onClick={handleGenerateBtn}
              disabled={isLoading}
              className="w-full bg-[#12102D] text-white font-bold hover:opacity-85 rounded-xl"
            >
              {isLoading ? (
                <Loader2 className="animate-spin size-10" />
              ) : (
                "Generate QR Code"
              )}
            </Button>
            <Button
              onClick={handleShareBtn}
              disabled={isLoading || !barcode}
              className="ml-4 bg-[#12102D] text-white font-bold hover:opacity-85 rounded-xl"
            >
              <Share2 className="mr-2" />
              Share QR Code
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
