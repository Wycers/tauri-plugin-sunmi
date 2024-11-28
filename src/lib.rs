use tauri::{
    plugin::{Builder, TauriPlugin},
    Manager, Runtime,
};

pub use models::*;

#[cfg(desktop)]
mod desktop;
#[cfg(mobile)]
mod mobile;

mod commands;
mod error;
mod models;

pub use error::{Error, Result};

#[cfg(desktop)]
use desktop::Sunmi;
#[cfg(mobile)]
use mobile::Sunmi;

/// Extensions to [`tauri::App`], [`tauri::AppHandle`] and [`tauri::Window`] to access the sunmi APIs.
pub trait SunmiExt<R: Runtime> {
    fn sunmi(&self) -> &Sunmi<R>;
}

impl<R: Runtime, T: Manager<R>> crate::SunmiExt<R> for T {
    fn sunmi(&self) -> &Sunmi<R> {
        self.state::<Sunmi<R>>().inner()
    }
}

/// Initializes the plugin.
pub fn init<R: Runtime>() -> TauriPlugin<R> {
    Builder::new("sunmi")
        .invoke_handler(tauri::generate_handler![commands::ping, commands::print])
        .setup(|app, api| {
            #[cfg(mobile)]
            let sunmi = mobile::init(app, api)?;
            #[cfg(desktop)]
            let sunmi = desktop::init(app, api)?;
            app.manage(sunmi);
            Ok(())
        })
        .build()
}
