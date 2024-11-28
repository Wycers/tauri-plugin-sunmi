import { SunmiFontSize, SunmiPrintAlign } from "./enums";
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
