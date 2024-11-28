import { SunmiPrintAlign } from "./enums";
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
