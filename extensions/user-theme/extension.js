// -*- mode: js2; indent-tabs-mode: nil; js2-basic-offset: 4 -*-
// Load shell theme from ~/.themes/name/gnome-shell

const GLib = imports.gi.GLib;
const Gio = imports.gi.Gio;
const Lang = imports.lang;
const Main = imports.ui.main;

const SETTINGS_SCHEMA = 'org.gnome.shell.extensions.user-theme';
const SETTINGS_KEY = 'name';

function ThemeManager() {
    this._init();
}

ThemeManager.prototype = {
    _init: function() {
        this._settings = new Gio.Settings({ schema: SETTINGS_SCHEMA });
        this._settings.connect('changed::'+SETTINGS_KEY, Lang.bind(this, this._changeTheme));
        this._changeTheme();
    },

    _changeTheme: function() {
        let _stylesheet = null;
        let _themeName = this._settings.get_string(SETTINGS_KEY);

        if (_themeName) {
            let _userCssStylesheet = GLib.get_home_dir() + '/.themes/' + _themeName + '/gnome-shell/gnome-shell.css';
            file = Gio.file_new_for_path(_userCssStylesheet);
            if (file.query_exists(null))
                _stylesheet = _userCssStylesheet;
        }

        if (_stylesheet) {
            global.log('loading user theme: ' + _stylesheet)
            Main.setThemeStylesheet(_stylesheet);
            Main.loadTheme();
        }
    }
}


function main(metadata) {
    new ThemeManager();
}
