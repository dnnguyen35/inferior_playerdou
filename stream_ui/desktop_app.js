import { app, BrowserWindow, globalShortcut, screen } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

app.disableHardwareAcceleration();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;

    const windowWidth = 800;
    const windowHeight = 600;

    const x = Math.round((width - windowWidth) / 2);
    const y = Math.round((height - windowHeight) / 2 - 200);

    const win = new BrowserWindow({
        width: windowWidth,
        height: windowHeight,

        x,
        y,

        transparent: true,
        frame: false,
        alwaysOnTop: true,
        hasShadow: false,
        resizable: false,

        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'),
            contextIsolation: true,
            nodeIntegration: false,
            webSecurity: false,
            allowRunningInsecureContent: true,
            autoplayPolicy: 'no-user-gesture-required'
        }
    });

    win.setAlwaysOnTop(true, 'floating');

    win.loadFile(path.join(__dirname, 'index.html'));
}

app.whenReady().then(() => {
    createWindow();

    globalShortcut.register(
        'CommandOrControl+Alt+X',
        () => {
            console.log('Đóng ứng dụng alert!');
            app.quit();
        }
    );
});

app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
