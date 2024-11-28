export enum PrinterStatus {
  UNKNOWN,
  ERROR,
  NORMAL,
  ABNORMAL_COMMUNICATION,
  OUT_OF_PAPER,
  PREPARING,
  OVERHEATED,
  OPEN_THE_LID,
  PAPER_CUTTER_ABNORMAL,
  PAPER_CUTTER_RECOVERED,
  NO_BLACK_MARK,
  NO_PRINTER_DETECTED,
  FAILED_TO_UPGRADE_FIRMWARE,
  EXCEPTION,
}

export enum PrinterMode {
  UNKNOWN,
  NORMAL_MODE,
  BLACK_LABEL_MODE,
  LABEL_MODE,
}

export enum SunmiPrintAlign {
  LEFT,
  CENTER,
  RIGHT,
}

//export Enum to set a QRcode Level (Low to High)
export enum SunmiQrcodeLevel {
  LEVEL_L,
  LEVEL_M,
  LEVEL_Q,
  LEVEL_H,
}

export enum SunmiBarcodeType {
  UPCA,
  UPCE,
  JAN13,
  JAN8,
  CODE39,
  ITF,
  CODABAR,
  CODE93,
  CODE128,
}

export enum SunmiBarcodeTextPos {
  NO_TEXT,
  TEXT_ABOVE,
  TEXT_UNDER,
  BOTH,
}

export enum SunmiFontSize {
  XS,
  SM,
  MD,
  LG,
  XL,
}
