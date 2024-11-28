import { invoke } from "@tauri-apps/api/core";

import {
  PrinterMode,
  PrinterStatus,
  SunmiBarcodeTextPos,
  SunmiBarcodeType,
  SunmiFontSize,
  SunmiPrintAlign,
  SunmiQrcodeLevel,
  SunmiStyle,
  ColumnMaker,
} from "./models";

export async function ping(value: string): Promise<string | null> {
  return await invoke<{ value?: string }>("plugin:sunmi|ping", {
    payload: {
      value,
    },
  }).then((r) => (r.value ? r.value : null));
}

export async function print(
  method: string,
  args: Record<string, unknown>
): Promise<string | null> {
  return await invoke<{ result?: string }>("plugin:sunmi|print", {
    payload: {
      method,
      args: JSON.stringify(args),
    },
  }).then((r) => (r.result ? r.result : null));
}

export class SunmiPrinter {
  private static readonly printerStatus: Record<string, string> = {
    ERROR: "Something went wrong.",
    NORMAL: "Works normally",
    ABNORMAL_COMMUNICATION: "Abnormal communication",
    OUT_OF_PAPER: "Out of paper",
    PREPARING: "Preparing printer",
    OVERHEATED: "Overheated",
    OPEN_THE_LID: "Open the lid",
    PAPER_CUTTER_ABNORMAL: "The paper cutter is abnormal",
    PAPER_CUTTER_RECOVERED: "The paper cutter has been recovered",
    NO_BLACK_MARK: "No black mark had been detected",
    NO_PRINTER_DETECTED: "No printer had been detected",
    FAILED_TO_UPGRADE_FIRMWARE: "Failed to upgrade firmware",
    EXCEPTION: "Unknown Error code",
  };

  private static readonly paperSizes: number[] = [80, 58];

  static async bindingPrinter(): Promise<boolean | null> {
    const status = await print("BIND_PRINTER_SERVICE", {});
    return status === "true";
  }

  static async unbindingPrinter(): Promise<boolean | null> {
    const status = await print("UNBIND_PRINTER_SERVICE", {});
    return status === "true";
  }

  static async initPrinter(): Promise<boolean | null> {
    const status = await print("INIT_PRINTER", {});
    return status === "true";
  }

  static async getPrinterStatus(): Promise<PrinterStatus> {
    const status = await print("GET_UPDATE_PRINTER", {});
    switch (status) {
      case "ERROR":
        return PrinterStatus.ERROR;
      case "NORMAL":
        return PrinterStatus.NORMAL;
      case "ABNORMAL_COMMUNICATION":
        return PrinterStatus.ABNORMAL_COMMUNICATION;
      case "OUT_OF_PAPER":
        return PrinterStatus.OUT_OF_PAPER;
      case "PREPARING":
        return PrinterStatus.PREPARING;
      case "OVERHEATED":
        return PrinterStatus.OVERHEATED;
      case "OPEN_THE_LID":
        return PrinterStatus.OPEN_THE_LID;
      case "PAPER_CUTTER_ABNORMAL":
        return PrinterStatus.PAPER_CUTTER_ABNORMAL;
      case "PAPER_CUTTER_RECOVERED":
        return PrinterStatus.PAPER_CUTTER_RECOVERED;
      case "NO_BLACK_MARK":
        return PrinterStatus.NO_BLACK_MARK;
      case "NO_PRINTER_DETECTED":
        return PrinterStatus.NO_PRINTER_DETECTED;
      case "FAILED_TO_UPGRADE_FIRMWARE":
        return PrinterStatus.FAILED_TO_UPGRADE_FIRMWARE;
      case "EXCEPTION":
        return PrinterStatus.EXCEPTION;
      default:
        return PrinterStatus.UNKNOWN;
    }
  }

  static async getPrinterStatusWithVerbose(): Promise<string | undefined> {
    const status = await print("GET_UPDATE_PRINTER", {});
    return this.printerStatus[status || "EXCEPTION"];
  }

  static async getPrinterMode(): Promise<PrinterMode> {
    const mode = await print("GET_PRINTER_MODE", {});
    switch (mode) {
      case "NORMAL_MODE":
        return PrinterMode.NORMAL_MODE;
      case "BLACK_LABEL_MODE":
        return PrinterMode.BLACK_LABEL_MODE;
      case "LABEL_MODE":
        return PrinterMode.LABEL_MODE;
      default:
        return PrinterMode.UNKNOWN;
    }
  }

  static async printText(text: string, style?: SunmiStyle): Promise<void> {
    if (style) {
      if (style.align !== undefined) await this.setAlignment(style.align);
      if (style.fontSize !== undefined) await this.setFontSize(style.fontSize);
      if (style.bold) await this.bold();
    }
    await print("PRINT_TEXT", { text: `${text}\n` });
    await this.initPrinter();
  }

  static async printRow(
    cols: ColumnMaker[],
    isArabic: boolean = false
  ): Promise<void> {
    const colsJson = JSON.stringify(cols.map((col) => col.toJson()));
    await print("PRINT_ROW", { cols: colsJson, arabic: isArabic });
  }

  static async printRawData(data: Uint8Array): Promise<void> {
    await print("RAW_DATA", { data });
  }

  static async printQRCode(
    data: string,
    size: number = 5,
    errorLevel: SunmiQrcodeLevel = SunmiQrcodeLevel.LEVEL_H
  ): Promise<void> {
    const errorLevels = {
      [SunmiQrcodeLevel.LEVEL_L]: 0,
      [SunmiQrcodeLevel.LEVEL_M]: 1,
      [SunmiQrcodeLevel.LEVEL_Q]: 2,
      [SunmiQrcodeLevel.LEVEL_H]: 3,
    };
    await print("PRINT_QRCODE", {
      data,
      modulesize: size,
      errorlevel: errorLevels[errorLevel],
    });
  }

  static async printBarCode(
    data: string,
    barcodeType: SunmiBarcodeType = SunmiBarcodeType.CODE128,
    height: number = 162,
    width: number = 2,
    textPosition: SunmiBarcodeTextPos = SunmiBarcodeTextPos.TEXT_ABOVE
  ): Promise<void> {
    const barcodeTypes = {
      [SunmiBarcodeType.UPCA]: 0,
      [SunmiBarcodeType.UPCE]: 1,
      [SunmiBarcodeType.JAN13]: 2,
      [SunmiBarcodeType.JAN8]: 3,
      [SunmiBarcodeType.CODE39]: 4,
      [SunmiBarcodeType.ITF]: 5,
      [SunmiBarcodeType.CODABAR]: 6,
      [SunmiBarcodeType.CODE93]: 7,
      [SunmiBarcodeType.CODE128]: 8,
    };
    const textPositions = {
      [SunmiBarcodeTextPos.NO_TEXT]: 0,
      [SunmiBarcodeTextPos.TEXT_ABOVE]: 1,
      [SunmiBarcodeTextPos.TEXT_UNDER]: 2,
      [SunmiBarcodeTextPos.BOTH]: 3,
    };
    await print("PRINT_BARCODE", {
      data,
      barcodeType: barcodeTypes[barcodeType],
      textPosition: textPositions[textPosition],
      width,
      height,
    });
  }

  static async lineWrap(lines: number): Promise<void> {
    await print("LINE_WRAP", { lines });
  }

  static async line(ch: string = "-", len: number = 31): Promise<void> {
    await this.resetFontSize();
    await this.printText(ch.repeat(len));
  }

  static async bold(): Promise<void> {
    await this.printRawData(new Uint8Array([27, 69, 1]));
  }

  static async resetBold(): Promise<void> {
    await this.printRawData(new Uint8Array([27, 69, 0]));
  }

  static async setAlignment(alignment: SunmiPrintAlign): Promise<void> {
    const alignments = {
      [SunmiPrintAlign.LEFT]: 0,
      [SunmiPrintAlign.CENTER]: 1,
      [SunmiPrintAlign.RIGHT]: 2,
    };
    await print("SET_ALIGNMENT", { alignment: alignments[alignment] });
  }

  static async printImage(img: Uint8Array): Promise<void> {
    await print("PRINT_IMAGE", { bitmap: img });
  }

  static async startTransactionPrint(clear: boolean = false): Promise<void> {
    await print("ENTER_PRINTER_BUFFER", { clearEnter: clear });
  }

  static async submitTransactionPrint(): Promise<void> {
    await print("COMMIT_PRINTER_BUFFER", {});
  }

  static async cut(): Promise<void> {
    await print("CUT_PAPER", {});
  }

  static async openDrawer(): Promise<void> {
    await print("OPEN_DRAWER", {});
  }

  static async drawerStatus(): Promise<boolean> {
    const status = await print("DRAWER_STATUS", {});
    return status === "true";
  }

  static async drawerTimesOpen(): Promise<number> {
    const times = await print("DRAWER_OPENED", {});
    return parseInt(times || "0", 10);
  }

  static async exitTransactionPrint(clear: boolean = true): Promise<void> {
    await print("EXIT_PRINTER_BUFFER", { clearExit: clear });
  }

  static async setFontSize(size: SunmiFontSize): Promise<void> {
    const fontSizes = {
      [SunmiFontSize.XS]: 14,
      [SunmiFontSize.SM]: 18,
      [SunmiFontSize.MD]: 24,
      [SunmiFontSize.LG]: 36,
      [SunmiFontSize.XL]: 42,
    };
    await print("FONT_SIZE", { size: fontSizes[size] });
  }

  static async setCustomFontSize(size: number): Promise<void> {
    await print("FONT_SIZE", { size });
  }

  static async resetFontSize(): Promise<void> {
    await print("FONT_SIZE", { size: 24 });
  }

  static async paperSize(): Promise<number> {
    const size = await print("PAPER_SIZE", {});
    return this.paperSizes[parseInt(size || "0", 10)];
  }

  static async serialNumber(): Promise<string> {
    return (await print("PRINTER_SERIAL_NUMBER", {})) || "";
  }

  static async printerVersion(): Promise<string> {
    return (await print("PRINTER_VERSION", {})) || "";
  }

  static async startLabelPrint(): Promise<void> {
    await print("LABEL_LOCATE", {});
  }

  static async exitLabelPrint(): Promise<void> {
    await print("LABEL_OUTPUT", {});
  }

  // Add LCD methods here as needed...
}
