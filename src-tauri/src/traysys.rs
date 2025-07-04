use tauri;
use tauri::{
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    Manager,
};
use tauri_plugin_positioner::{self, WindowExt};

pub fn createTray(app: &tauri::App) {
    TrayIconBuilder::new().icon(app.default_window_icon().unwrap().clone())
        .on_tray_icon_event(|tray, event| {
            tauri_plugin_positioner::on_tray_event(tray.app_handle(), &event);
            match event {
                TrayIconEvent::Click {
                    button: MouseButton::Left,
                    button_state: MouseButtonState::Up,
                    position,
                    ..
                } => {
                    let app = tray.app_handle();
                    if let Some(window) = app.get_webview_window("main") {
                        let tray_x = position.x as i32;
                        let tray_y = position.y as i32;

                        let win_height = window.outer_size().unwrap().height as u32;
                        let win_width = window.outer_size().unwrap().width as u32;
                        let size = window.current_monitor().unwrap().unwrap().size().clone();
                        let win_x = size.width;
                        let win_y = size.height;
                        let new_x = win_x - win_width;
                        let new_y = win_y - win_height;

                        window
                            .set_position(tauri::LogicalPosition::new(new_x, new_y))
                            .unwrap();
                        let _ = window.show();
                        let _ = window.set_focus();
                    }
                }
                _ => {}
            }
        })
        .build(app)
        .expect("Error creating tray!");
}
