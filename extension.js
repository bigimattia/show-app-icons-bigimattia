const { St, Clutter, Meta } = imports.gi;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const { AppDisplay } = imports.gi.Shell;

let appIconContainer;
let windowCreatedSignal, windowRemovedSignal;

function init() {
    // Vuoto: GNOME inizializza qui ma non richiede configurazioni particolari.
}

function enable() {
    // Crea un nuovo contenitore per le icone
    appIconContainer = new PanelMenu.Button(0.0, 'AppIconContainer', false);
    Main.panel.addToStatusArea('app-icon-container', appIconContainer);

    // Aggiorna le icone inizialmente e ogni volta che una finestra viene aggiunta o rimossa
    updateAppIcons();

    // Connetti i segnali per aggiornare le icone quando cambia lo stato delle finestre
    windowCreatedSignal = global.display.connect('window-created', updateAppIcons);
    windowRemovedSignal = global.display.connect('window-removed', updateAppIcons);
}

function disable() {
    // Rimuovi il contenitore delle icone e disconnetti i segnali
    if (appIconContainer) {
        appIconContainer.destroy();
        appIconContainer = null;
    }

    if (windowCreatedSignal) {
        global.display.disconnect(windowCreatedSignal);
        windowCreatedSignal = null;
    }

    if (windowRemovedSignal) {
        global.display.disconnect(windowRemovedSignal);
        windowRemovedSignal = null;
    }
}

function updateAppIcons() {
    // Rimuovi tutte le icone precedenti
    appIconContainer.remove_all_children();

    // Ottieni tutte le aree di lavoro
    const workspaces = global.workspace_manager.get_n_workspaces();

    for (let i = 0; i < workspaces; i++) {
        // Ottieni tutte le finestre per l'area di lavoro corrente
        const windows = global.display.get_tab_list(Meta.TabList.NORMAL, global.workspace_manager.get_workspace_by_index(i));

        // Aggiungi l’icona per ogni finestra
        windows.forEach(win => {
            const app = win.get_meta_window().get_wm_class();
            const icon = app.get_icon();
            const iconActor = new St.Icon({
                gicon: icon,
                style_class: 'system-status-icon'
            });

            // Imposta il comportamento al clic dell'icona
            iconActor.connect('button-press-event', () => {
                if (event.get_button() === Clutter.BUTTON_SECONDARY) {
                    Main.ctrlAltTabManager.showWindowMenu(win.get_meta_window());
                } else {
                    Main.activateWindow(win.get_meta_window());
                }
            });

            appIconContainer.add_child(iconActor);
        });
    }
}

