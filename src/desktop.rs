use serde::de::DeserializeOwned;
use tauri::{plugin::PluginApi, utils::acl::Value, AppHandle, Runtime};

use crate::models::*;

pub fn init<R: Runtime, C: DeserializeOwned>(
    app: &AppHandle<R>,
    _api: PluginApi<R, C>,
) -> crate::Result<Sunmi<R>> {
    Ok(Sunmi(app.clone()))
}

/// Access to the sunmi APIs.
pub struct Sunmi<R: Runtime>(AppHandle<R>);

impl<R: Runtime> Sunmi<R> {
    pub fn ping(&self, payload: PingRequest) -> crate::Result<PingResponse> {
        Ok(PingResponse {
            value: payload.value,
        })
    }
}

impl<R: Runtime> Sunmi<R> {
    pub fn print(&self, _payload: PrintRequest) -> crate::Result<PrintResponse> {
        Ok(PrintResponse {
            result: Some(Value::Bool(true)),
        })
    }
}
