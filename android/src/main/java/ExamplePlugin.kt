
package com.plugin.sunmi

import android.app.Activity
import android.util.Log
import app.tauri.annotation.Command
import app.tauri.annotation.InvokeArg
import app.tauri.annotation.TauriPlugin
import app.tauri.plugin.Invoke
import app.tauri.plugin.JSArray
import app.tauri.plugin.JSObject
import app.tauri.plugin.Plugin
import org.json.JSONObject

@InvokeArg
class PingArgs {
    var value: String? = null
}

@InvokeArg
class PrintArgs {
    var method: String? = null
    var args: String? = null
}

@TauriPlugin
class ExamplePlugin(private val activity: Activity) : Plugin(activity) {
    private val implementation = Example()
    private val sunmiPrinterMethod = SunmiPrinterMethod(activity)

    @Command
    fun ping(invoke: Invoke) {
        val args = invoke.parseArgs(PingArgs::class.java)

        val ret = JSObject()
        ret.put("value", implementation.pong(args.value ?: "default value :("))
        invoke.resolve(ret)
    }

    @Command
    fun print(invoke: Invoke) {
        val invokeArgs = invoke.parseArgs(PrintArgs::class.java)

        val method = invokeArgs.method
        val args = invokeArgs.args?.let { JSONObject(it) }
        val ret = JSObject()
        when (method) {
            "BIND_PRINTER_SERVICE" -> {
                sunmiPrinterMethod.bindPrinterService()
                ret.put("result", true)
            }
            "UNBIND_PRINTER_SERVICE" -> {
                sunmiPrinterMethod.unbindPrinterService()
                ret.put("result", true)
            }
            "INIT_PRINTER" -> {
                sunmiPrinterMethod.initPrinter()
                ret.put("result", true)
            }
            "GET_UPDATE_PRINTER" -> {
                val statusCode = sunmiPrinterMethod.updatePrinter()

                val statusMsg = when (statusCode) {
                    0 -> "ERROR"
                    1 -> "NORMAL"
                    2 -> "ABNORMAL_COMMUNICATION"
                    3 -> "OUT_OF_PAPER"
                    4 -> "PREPARING"
                    5 -> "OVERHEATED"
                    6 -> "OPEN_THE_LID"
                    7 -> "PAPER_CUTTER_ABNORMAL"
                    8 -> "PAPER_CUTTER_RECOVERED"
                    9 -> "NO_BLACK_MARK"
                    505 -> "NO_PRINTER_DETECTED"
                    507 -> "FAILED_TO_UPGRADE_FIRMWARE"
                    else -> "EXCEPTION"
                }

                ret.put("result", statusMsg)
            }
            "PRINT_TEXT" -> {
                val text: String? = args?.getString("text")
                text?.let { sunmiPrinterMethod.printText(it) }
                ret.put("result", true)
            }
//            "RAW_DATA" -> {
//                val data: ByteArray? = args?.getString("data")
//                data?.let { sunmiPrinterMethod.sendRaw(it) }
//                ret.put("result", true)
//            }
            "PRINT_QRCODE" -> {
                val data: String? = args?.getString("data")
                val modulesize: Int? = args?.getInt("modulesize")
                val errorlevel: Int? = args?.getInt("errorlevel")
                if (data != null && modulesize != null && errorlevel != null) {
                    sunmiPrinterMethod.printQRCode(data, modulesize, errorlevel)
                    ret.put("result", true)
                }
            }
            "PRINT_BARCODE" -> {
                val barCodeData: String? = args?.getString("data")
                val barcodeType: Int? = args?.getInt("barcodeType")
                val textPosition: Int? = args?.getInt("textPosition")
                val width: Int? = args?.getInt("width")
                val height: Int? = args?.getInt("height")
                if (barCodeData != null && barcodeType != null && textPosition != null && width != null && height != null) {
                    sunmiPrinterMethod.printBarCode(barCodeData, barcodeType, textPosition, width, height)
                    sunmiPrinterMethod.lineWrap(1)
                    ret.put("result", true)
                }
            }
            "LINE_WRAP" -> {
                val lines: Int? = args?.getInt("lines")
                lines?.let { sunmiPrinterMethod.lineWrap(it) }
                ret.put("result", true)
            }
            "FONT_SIZE" -> {
                val fontSize: Int? = args?.getInt("size")
                fontSize?.let { sunmiPrinterMethod.setFontSize(it) }
                ret.put("result", true)
            }
            "SET_ALIGNMENT" -> {
                val alignment: Int? = args?.getInt("alignment")
                alignment?.let { sunmiPrinterMethod.setAlignment(it) }
                ret.put("result", true)
            }
//            "PRINT_IMAGE" -> {
//                val bytes: ByteArray? = args?.getString("bitmap")
//                bytes?.let {
//                    val bitmap = BitmapFactory.decodeByteArray(it, 0, it.size)
//                    sunmiPrinterMethod.printImage(bitmap)
//                    ret.put("result", true)
//                }
//            }
            "GET_PRINTER_MODE" -> {
                val modeCode = sunmiPrinterMethod.getPrinterMode()

                val modeDesc = when (modeCode) {
                    0 -> "NORMAL_MODE"
                    1 -> "BLACK_LABEL_MODE"
                    2 -> "LABEL_MODE"
                    3 -> "ERROR"
                    else -> "EXCEPTION"
                }

                ret.put("result", modeDesc)
            }
            "ENTER_PRINTER_BUFFER" -> {
                val clearEnter: Boolean? = args?.getBoolean("clearEnter")
                clearEnter?.let { sunmiPrinterMethod.enterPrinterBuffer(it) }
                ret.put("result", true)
            }
            "COMMIT_PRINTER_BUFFER" -> {
                sunmiPrinterMethod.commitPrinterBuffer()
                ret.put("result", true)
            }
            "CUT_PAPER" -> {
                sunmiPrinterMethod.cutPaper()
                ret.put("result", true)
            }
            "OPEN_DRAWER" -> {
                sunmiPrinterMethod.openDrawer()
                ret.put("result", true)
            }
            "DRAWER_OPENED" -> {
                ret.put("result", sunmiPrinterMethod.timesOpened())
            }
            "DRAWER_STATUS" -> {
                ret.put("result", sunmiPrinterMethod.drawerStatus())
            }
            "PRINT_ROW" -> {
                val colsStr: String? = args?.getString("cols")
                val arabic: Boolean? = args?.getBoolean("arabic")

                try {
                    if (colsStr != null && arabic != null) {
                        val cols = JSArray(colsStr)
                        val colsText = Array(cols.length()) { "" }
                        val colsWidth = IntArray(cols.length())
                        val colsAlign = IntArray(cols.length())
                        for (i in 0 until cols.length()) {
                            val col = cols.getJSONObject(i)
                            colsText[i] = col.getString("text")
                            colsWidth[i] = col.getInt("width")
                            colsAlign[i] = col.getInt("align")
                        }
                        sunmiPrinterMethod.printColumn(colsText, colsWidth, colsAlign, arabic)
                        ret.put("result", true)
                    }
                } catch (err: Exception) {
                    Log.d("SunmiPrinter", err.message ?: "Unknown error")
                }
            }
            "EXIT_PRINTER_BUFFER" -> {
                val clearExit: Boolean? = args?.getBoolean("clearExit")
                clearExit?.let { sunmiPrinterMethod.exitPrinterBuffer(it) }
                ret.put("result", true)
            }
            "PRINTER_SERIAL_NUMBER" -> {
                val serial = sunmiPrinterMethod.getPrinterSerialNo()
                ret.put("result", serial)
            }
            "PRINTER_VERSION" -> {
                val printerVersion = sunmiPrinterMethod.getPrinterVersion()
                ret.put("result", printerVersion)
            }
            "PAPER_SIZE" -> {
                val paper = sunmiPrinterMethod.getPrinterPaper()
                ret.put("result", paper)
            }
            "LABEL_LOCATE" -> {
                sunmiPrinterMethod.labelLocate()
                ret.put("result", true)
            }
            "LABEL_OUTPUT" -> {
                sunmiPrinterMethod.labelOutput()
                ret.put("result", true)
            }
        }
        invoke.resolve(ret)
    }
}
