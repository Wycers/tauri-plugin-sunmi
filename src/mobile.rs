use serde::de::DeserializeOwned;
use tauri::{
    plugin::{PluginApi, PluginHandle},
    AppHandle, Runtime,
};

use crate::models::*;

#[cfg(target_os = "android")]
const PLUGIN_IDENTIFIER: &str = "com.plugin.sunmi";

#[cfg(target_os = "ios")]
tauri::ios_plugin_binding!(init_plugin_sunmi);

// initializes the Kotlin or Swift plugin classes
pub fn init<R: Runtime, C: DeserializeOwned>(
    _app: &AppHandle<R>,
    api: PluginApi<R, C>,
) -> crate::Result<Sunmi<R>> {
    #[cfg(target_os = "android")]
    let handle = api.register_android_plugin(PLUGIN_IDENTIFIER, "ExamplePlugin")?;
    #[cfg(target_os = "ios")]
    let handle = api.register_ios_plugin(init_plugin_sunmi)?;
    Ok(Sunmi(handle))
}

/// Access to the sunmi APIs.
pub struct Sunmi<R: Runtime>(PluginHandle<R>);

impl<R: Runtime> Sunmi<R> {
    pub fn ping(&self, payload: PingRequest) -> crate::Result<PingResponse> {
        self.0
            .run_mobile_plugin("ping", payload)
            .map_err(Into::into)
    }
}

impl<R: Runtime> Sunmi<R> {
    pub fn print(&self, payload: PrintRequest) -> crate::Result<PrintResponse> {
        self.0
            .run_mobile_plugin("print", payload)
            .map_err(Into::into)
    }
}
