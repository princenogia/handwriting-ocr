// src/types/pdfjs.d.ts

// ✅ Legacy compatibility (if you ever import webpack.mjs)
declare module 'pdfjs-dist/webpack.mjs' {
  export * from 'pdfjs-dist'
}

// ✅ Modern browser-safe entry point
declare module 'pdfjs-dist/build/pdf' {
  const pdfjsLib: any
  export = pdfjsLib
}
declare module "pdfjs-dist/build/pdf.mjs" {
  export * from "pdfjs-dist/types/src/pdf";
  export const GlobalWorkerOptions: any;
}

declare module "pdfjs-dist/build/pdf.worker.mjs?url" {
  const workerSrc: string;
  export default workerSrc;
}

// ✅ Worker loader (used in modern Next.js/Vite builds)
declare module 'pdfjs-dist/build/pdf.worker.mjs?url' {
  const workerUrl: string
  export default workerUrl
}

// ✅ Optional fallback for direct worker import
declare module 'pdfjs-dist/build/pdf.worker.mjs' {
  const worker: any
  export default worker
}
declare module 'pdfjs-dist/legacy/build/pdf.js' {
  const pdfjs: any
  export = pdfjs
}
declare module "pdfjs-dist/legacy/build/pdf.mjs" {
  export * from "pdfjs-dist/types/src/pdf";
  export const GlobalWorkerOptions: any;
}
declare module "pdfjs-dist/legacy/build/pdf.worker.mjs?url" {
  const workerSrc: string;
  export default workerSrc;
}
declare module "pdf-parse" {
  const pdfParse: (data: Buffer | Uint8Array) => Promise<{ text: string }>;
  export default pdfParse;
}
