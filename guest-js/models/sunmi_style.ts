import { SunmiFontSize, SunmiPrintAlign } from "./enums";

export class SunmiStyle {
  fontSize?: SunmiFontSize;
  align?: SunmiPrintAlign;
  bold?: boolean;

  constructor({
    fontSize,
    align,
    bold,
  }: {
    fontSize?: SunmiFontSize;
    align?: SunmiPrintAlign;
    bold?: boolean;
  } = {}) {
    this.fontSize = fontSize;
    this.align = align;
    this.bold = bold;
  }
}
