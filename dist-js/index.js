import { invoke } from '@tauri-apps/api/core';

var PrinterStatus;
(function (PrinterStatus) {
    PrinterStatus[PrinterStatus["UNKNOWN"] = 0] = "UNKNOWN";
    PrinterStatus[PrinterStatus["ERROR"] = 1] = "ERROR";
    PrinterStatus[PrinterStatus["NORMAL"] = 2] = "NORMAL";
    PrinterStatus[PrinterStatus["ABNORMAL_COMMUNICATION"] = 3] = "ABNORMAL_COMMUNICATION";
    PrinterStatus[PrinterStatus["OUT_OF_PAPER"] = 4] = "OUT_OF_PAPER";
    PrinterStatus[PrinterStatus["PREPARING"] = 5] = "PREPARING";
    PrinterStatus[PrinterStatus["OVERHEATED"] = 6] = "OVERHEATED";
    PrinterStatus[PrinterStatus["OPEN_THE_LID"] = 7] = "OPEN_THE_LID";
    PrinterStatus[PrinterStatus["PAPER_CUTTER_ABNORMAL"] = 8] = "PAPER_CUTTER_ABNORMAL";
    PrinterStatus[PrinterStatus["PAPER_CUTTER_RECOVERED"] = 9] = "PAPER_CUTTER_RECOVERED";
    PrinterStatus[PrinterStatus["NO_BLACK_MARK"] = 10] = "NO_BLACK_MARK";
    PrinterStatus[PrinterStatus["NO_PRINTER_DETECTED"] = 11] = "NO_PRINTER_DETECTED";
    PrinterStatus[PrinterStatus["FAILED_TO_UPGRADE_FIRMWARE"] = 12] = "FAILED_TO_UPGRADE_FIRMWARE";
    PrinterStatus[PrinterStatus["EXCEPTION"] = 13] = "EXCEPTION";
})(PrinterStatus || (PrinterStatus = {}));
var PrinterMode;
(function (PrinterMode) {
    PrinterMode[PrinterMode["UNKNOWN"] = 0] = "UNKNOWN";
    PrinterMode[PrinterMode["NORMAL_MODE"] = 1] = "NORMAL_MODE";
    PrinterMode[PrinterMode["BLACK_LABEL_MODE"] = 2] = "BLACK_LABEL_MODE";
    PrinterMode[PrinterMode["LABEL_MODE"] = 3] = "LABEL_MODE";
})(PrinterMode || (PrinterMode = {}));
var SunmiPrintAlign;
(function (SunmiPrintAlign) {
    SunmiPrintAlign[SunmiPrintAlign["LEFT"] = 0] = "LEFT";
    SunmiPrintAlign[SunmiPrintAlign["CENTER"] = 1] = "CENTER";
    SunmiPrintAlign[SunmiPrintAlign["RIGHT"] = 2] = "RIGHT";
})(SunmiPrintAlign || (SunmiPrintAlign = {}));
//export Enum to set a QRcode Level (Low to High)
var SunmiQrcodeLevel;
(function (SunmiQrcodeLevel) {
    SunmiQrcodeLevel[SunmiQrcodeLevel["LEVEL_L"] = 0] = "LEVEL_L";
    SunmiQrcodeLevel[SunmiQrcodeLevel["LEVEL_M"] = 1] = "LEVEL_M";
    SunmiQrcodeLevel[SunmiQrcodeLevel["LEVEL_Q"] = 2] = "LEVEL_Q";
    SunmiQrcodeLevel[SunmiQrcodeLevel["LEVEL_H"] = 3] = "LEVEL_H";
})(SunmiQrcodeLevel || (SunmiQrcodeLevel = {}));
var SunmiBarcodeType;
(function (SunmiBarcodeType) {
    SunmiBarcodeType[SunmiBarcodeType["UPCA"] = 0] = "UPCA";
    SunmiBarcodeType[SunmiBarcodeType["UPCE"] = 1] = "UPCE";
    SunmiBarcodeType[SunmiBarcodeType["JAN13"] = 2] = "JAN13";
    SunmiBarcodeType[SunmiBarcodeType["JAN8"] = 3] = "JAN8";
    SunmiBarcodeType[SunmiBarcodeType["CODE39"] = 4] = "CODE39";
    SunmiBarcodeType[SunmiBarcodeType["ITF"] = 5] = "ITF";
    SunmiBarcodeType[SunmiBarcodeType["CODABAR"] = 6] = "CODABAR";
    SunmiBarcodeType[SunmiBarcodeType["CODE93"] = 7] = "CODE93";
    SunmiBarcodeType[SunmiBarcodeType["CODE128"] = 8] = "CODE128";
})(SunmiBarcodeType || (SunmiBarcodeType = {}));
var SunmiBarcodeTextPos;
(function (SunmiBarcodeTextPos) {
    SunmiBarcodeTextPos[SunmiBarcodeTextPos["NO_TEXT"] = 0] = "NO_TEXT";
    SunmiBarcodeTextPos[SunmiBarcodeTextPos["TEXT_ABOVE"] = 1] = "TEXT_ABOVE";
    SunmiBarcodeTextPos[SunmiBarcodeTextPos["TEXT_UNDER"] = 2] = "TEXT_UNDER";
    SunmiBarcodeTextPos[SunmiBarcodeTextPos["BOTH"] = 3] = "BOTH";
})(SunmiBarcodeTextPos || (SunmiBarcodeTextPos = {}));
var SunmiFontSize;
(function (SunmiFontSize) {
    SunmiFontSize[SunmiFontSize["XS"] = 0] = "XS";
    SunmiFontSize[SunmiFontSize["SM"] = 1] = "SM";
    SunmiFontSize[SunmiFontSize["MD"] = 2] = "MD";
    SunmiFontSize[SunmiFontSize["LG"] = 3] = "LG";
    SunmiFontSize[SunmiFontSize["XL"] = 4] = "XL";
})(SunmiFontSize || (SunmiFontSize = {}));

async function ping(value) {
    return await invoke("plugin:sunmi|ping", {
        payload: {
            value,
        },
    }).then((r) => (r.value ? r.value : null));
}
async function print(method, args) {
    return await invoke("plugin:sunmi|print", {
        payload: {
            method,
            args: JSON.stringify(args),
        },
    }).then((r) => (r.result ? r.result : null));
}
class SunmiPrinter {
    static async bindingPrinter() {
        const status = await print("BIND_PRINTER_SERVICE", {});
        return status === "true";
    }
    static async unbindingPrinter() {
        const status = await print("UNBIND_PRINTER_SERVICE", {});
        return status === "true";
    }
    static async initPrinter() {
        const status = await print("INIT_PRINTER", {});
        return status === "true";
    }
    static async getPrinterStatus() {
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
    static async getPrinterStatusWithVerbose() {
        const status = await print("GET_UPDATE_PRINTER", {});
        return this.printerStatus[status || "EXCEPTION"];
    }
    static async getPrinterMode() {
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
    static async printText(text, style) {
        if (style) {
            if (style.align !== undefined)
                await this.setAlignment(style.align);
            if (style.fontSize !== undefined)
                await this.setFontSize(style.fontSize);
            if (style.bold)
                await this.bold();
        }
        await print("PRINT_TEXT", { text: `${text}\n` });
        await this.initPrinter();
    }
    static async printRow(cols, isArabic = false) {
        const colsJson = JSON.stringify(cols.map((col) => col.toJson()));
        await print("PRINT_ROW", { cols: colsJson, arabic: isArabic });
    }
    static async printRawData(data) {
        await print("RAW_DATA", { data });
    }
    static async printQRCode(data, size = 5, errorLevel = SunmiQrcodeLevel.LEVEL_H) {
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
    static async printBarCode(data, barcodeType = SunmiBarcodeType.CODE128, height = 162, width = 2, textPosition = SunmiBarcodeTextPos.TEXT_ABOVE) {
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
    static async lineWrap(lines) {
        await print("LINE_WRAP", { lines });
    }
    static async line(ch = "-", len = 31) {
        await this.resetFontSize();
        await this.printText(ch.repeat(len));
    }
    static async bold() {
        await this.printRawData(new Uint8Array([27, 69, 1]));
    }
    static async resetBold() {
        await this.printRawData(new Uint8Array([27, 69, 0]));
    }
    static async setAlignment(alignment) {
        const alignments = {
            [SunmiPrintAlign.LEFT]: 0,
            [SunmiPrintAlign.CENTER]: 1,
            [SunmiPrintAlign.RIGHT]: 2,
        };
        await print("SET_ALIGNMENT", { alignment: alignments[alignment] });
    }
    static async printImage(img) {
        await print("PRINT_IMAGE", { bitmap: img });
    }
    static async startTransactionPrint(clear = false) {
        await print("ENTER_PRINTER_BUFFER", { clearEnter: clear });
    }
    static async submitTransactionPrint() {
        await print("COMMIT_PRINTER_BUFFER", {});
    }
    static async cut() {
        await print("CUT_PAPER", {});
    }
    static async openDrawer() {
        await print("OPEN_DRAWER", {});
    }
    static async drawerStatus() {
        const status = await print("DRAWER_STATUS", {});
        return status === "true";
    }
    static async drawerTimesOpen() {
        const times = await print("DRAWER_OPENED", {});
        return parseInt(times || "0", 10);
    }
    static async exitTransactionPrint(clear = true) {
        await print("EXIT_PRINTER_BUFFER", { clearExit: clear });
    }
    static async setFontSize(size) {
        const fontSizes = {
            [SunmiFontSize.XS]: 14,
            [SunmiFontSize.SM]: 18,
            [SunmiFontSize.MD]: 24,
            [SunmiFontSize.LG]: 36,
            [SunmiFontSize.XL]: 42,
        };
        await print("FONT_SIZE", { size: fontSizes[size] });
    }
    static async setCustomFontSize(size) {
        await print("FONT_SIZE", { size });
    }
    static async resetFontSize() {
        await print("FONT_SIZE", { size: 24 });
    }
    static async paperSize() {
        const size = await print("PAPER_SIZE", {});
        return this.paperSizes[parseInt(size || "0", 10)];
    }
    static async serialNumber() {
        return (await print("PRINTER_SERIAL_NUMBER", {})) || "";
    }
    static async printerVersion() {
        return (await print("PRINTER_VERSION", {})) || "";
    }
    static async startLabelPrint() {
        await print("LABEL_LOCATE", {});
    }
    static async exitLabelPrint() {
        await print("LABEL_OUTPUT", {});
    }
}
SunmiPrinter.printerStatus = {
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
SunmiPrinter.paperSizes = [80, 58];

export { SunmiPrinter, ping, print };
