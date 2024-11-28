use tauri::{command, AppHandle, Runtime};

use crate::models::*;
use crate::Result;
use crate::SunmiExt;

#[command]
pub(crate) async fn ping<R: Runtime>(
    app: AppHandle<R>,
    payload: PingRequest,
) -> Result<PingResponse> {
    app.sunmi().ping(payload)
}

#[command]
pub(crate) async fn print<R: Runtime>(
    app: AppHandle<R>,
    payload: PrintRequest,
) -> Result<PrintResponse> {
    app.sunmi().print(payload)
}
