export declare enum PrinterStatus {
    UNKNOWN = 0,
    ERROR = 1,
    NORMAL = 2,
    ABNORMAL_COMMUNICATION = 3,
    OUT_OF_PAPER = 4,
    PREPARING = 5,
    OVERHEATED = 6,
    OPEN_THE_LID = 7,
    PAPER_CUTTER_ABNORMAL = 8,
    PAPER_CUTTER_RECOVERED = 9,
    NO_BLACK_MARK = 10,
    NO_PRINTER_DETECTED = 11,
    FAILED_TO_UPGRADE_FIRMWARE = 12,
    EXCEPTION = 13
}
export declare enum PrinterMode {
    UNKNOWN = 0,
    NORMAL_MODE = 1,
    BLACK_LABEL_MODE = 2,
    LABEL_MODE = 3
}
export declare enum SunmiPrintAlign {
    LEFT = 0,
    CENTER = 1,
    RIGHT = 2
}
export declare enum SunmiQrcodeLevel {
    LEVEL_L = 0,
    LEVEL_M = 1,
    LEVEL_Q = 2,
    LEVEL_H = 3
}
export declare enum SunmiBarcodeType {
    UPCA = 0,
    UPCE = 1,
    JAN13 = 2,
    JAN8 = 3,
    CODE39 = 4,
    ITF = 5,
    CODABAR = 6,
    CODE93 = 7,
    CODE128 = 8
}
export declare enum SunmiBarcodeTextPos {
    NO_TEXT = 0,
    TEXT_ABOVE = 1,
    TEXT_UNDER = 2,
    BOTH = 3
}
export declare enum SunmiFontSize {
    XS = 0,
    SM = 1,
    MD = 2,
    LG = 3,
    XL = 4
}
export declare class ColumnMaker {
    text: string;
    width: number;
    align: SunmiPrintAlign;
    constructor({ text, width, align, }: {
        text?: string;
        width?: number;
        align?: SunmiPrintAlign;
    });
    toJson(): {
        text: string;
        width: string;
        align: string;
    };
}
export declare class SunmiStyle {
    fontSize?: SunmiFontSize;
    align?: SunmiPrintAlign;
    bold?: boolean;
    constructor({ fontSize, align, bold, }?: {
        fontSize?: SunmiFontSize;
        align?: SunmiPrintAlign;
        bold?: boolean;
    });
}
