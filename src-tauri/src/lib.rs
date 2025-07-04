pub mod commands;
pub mod db;
pub mod reminder;
pub mod traysys;
use crate::commands::{delete_remind, get_reminds, insert_reminds, update_reminds};
use crate::db::Db;
use crate::reminder::Reminder;
use chrono::Local;
use std::sync::Arc;
use tauri::{Builder, Manager};
use traysys::createTray;

struct AppData {
    db: Arc<Db>,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_positioner::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            get_reminds,
            insert_reminds,
            delete_remind,
            update_reminds
        ])
        .on_window_event(|window, event| match event {
            tauri::WindowEvent::Focused(focused) => {
                if !focused {
                    window.hide();
                }
            }
            _ => {}
        })
        .setup(|app| {
            let db = Arc::new(Db::new()?);
            app.manage(AppData { db });
            traysys::createTray(app);
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
