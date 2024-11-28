import { SunmiPrintAlign } from "./enums";

export class ColumnMaker {
  text: string;
  width: number;
  align: SunmiPrintAlign;

  constructor({
    text = "",
    width = 2,
    align = SunmiPrintAlign.LEFT,
  }: {
    text?: string;
    width?: number;
    align?: SunmiPrintAlign;
  }) {
    this.text = text;
    this.width = width;
    this.align = align;
  }

  // Convert to JSON
  toJson(): { text: string; width: string; align: string } {
    let value = 0;
    switch (this.align) {
      case SunmiPrintAlign.CENTER:
        value = 1;
        break;
      case SunmiPrintAlign.RIGHT:
        value = 2;
        break;
      case SunmiPrintAlign.LEFT:
      default:
        value = 0;
        break;
    }
    return {
      text: this.text,
      width: this.width.toString(),
      align: value.toString(),
    };
  }
}
