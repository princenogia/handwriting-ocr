export const runtime = "nodejs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { fileData } = await req.json();

    if (!fileData) {
      console.error("❌ Missing file data");
      return NextResponse.json({ error: "No file data provided" }, { status: 400 });
    }

    const base64Data = fileData.split(",")[1];
    const buffer = Buffer.from(base64Data, "base64");

    let extractedText = "";

    try {
      console.log("📄 Loading pdfjs-dist...");
      const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
      const worker = await import("pdfjs-dist/legacy/build/pdf.worker.mjs?url");
      (pdfjsLib as any).GlobalWorkerOptions.workerSrc = worker.default;

      console.log("📖 Parsing PDF...");
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(" ");
        extractedText += `\n--- Page ${i} ---\n${pageText}`;
      }

      console.log("✅ PDF extraction done");
    } catch (parseErr: any) {
      console.error("⚠️ PDF.js extraction failed:", parseErr);
    }

    // If still empty, use OCR
    if (!extractedText.trim()) {
      console.warn("⚠️ No text found — using OCR fallback...");
      const ocrResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/ocr`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageData: fileData, mimeType: "application/pdf" }),
      });

      if (!ocrResponse.ok) {
        throw new Error(`OCR fallback failed (${ocrResponse.status})`);
      }

      const ocrResult = await ocrResponse.json();
      extractedText = ocrResult.text || "No readable text detected even after OCR.";
    }

    return NextResponse.json({ text: extractedText });
  } catch (error: any) {
    console.error("🔥 PDF route top-level error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process PDF" },
      { status: 500 }
    );
  }
}
