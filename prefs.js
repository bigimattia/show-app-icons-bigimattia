import Gio from "gi://Gio";
import Adw from "gi://Adw";

import { ExtensionPreferences } from "resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js";

export default class DashBarExtensionPreferences extends ExtensionPreferences {
  fillPreferencesWindow(window) {
    window._settings = this.getSettings();

    const page = new Adw.PreferencesPage({
      title: "Running apps extension",
      icon_name: "dialog-information-symbolic",
    });
    window.add(page);

    const group = new Adw.PreferencesGroup({
      title: "Settings",
    });
    page.add(group);

    const row_show_only_active_workspace_apps = new Adw.SwitchRow({
      title: "Show only apps in active workspace",
    });
    group.add(row_show_only_active_workspace_apps);
    window._settings.bind(
      "show-only-active-workspace-apps",
      row_show_only_active_workspace_apps,
      "active",
      Gio.SettingsBindFlags.DEFAULT
    );

    const row_enable_minimize_apps = new Adw.SwitchRow({
      title: "Enable minimize apps on click",
    });
    group.add(row_enable_minimize_apps);
    window._settings.bind(
      "enable-minimize-apps",
      row_enable_minimize_apps,
      "active",
      Gio.SettingsBindFlags.DEFAULT
    );
  }
}
