pub mod commands;
pub mod db;
pub mod reminder;
use crate::commands::{get_reminds, insert_reminds, delete_remind, update_reminds};
use crate::reminder::Reminder;
use crate::db::Db;
use std::sync::Arc;
use chrono::{Local};
use tauri::{Builder,Manager};

struct AppData{
    db : Arc<Db>,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![get_reminds, insert_reminds, delete_remind,update_reminds])
        .setup(|app|{
            let db = Arc::new(Db::new()?);
            app.manage(AppData{db});
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
