declare module "pdfjs-dist" {
    interface RenderParameters {
      canvasFactory?: {
        create: (width: number, height: number) => { canvas: any; context: any };
        reset: (canvasAndContext: any, width: number, height: number) => void;
        destroy: (canvasAndContext: any) => void;
      };
    }
  }
  