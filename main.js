const { app, BrowserWindow, Menu, ipcMain } = require("electron")

// include the Node.js 'path' module at the top of your file
const path = require("path")

// Test MAC
const isMac = process.platform === "darwin"

let mainWindow;
let addWindow;

// modify your existing createWindow() function
const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }
    })

    mainWindow.loadFile("index.html");
}

app.whenReady().then(() => {
    createWindow()

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })

    !isMac && mainWindow.on("closed", () => app.quit());

    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);
})

app.on("window-all-closed", () => {
    if (!isMac) app.quit()
})

function createAddWindow() {
    addWindow = new BrowserWindow({
        width: 450,
        height: 250,
        title: "Ajouter une nouvelle tâche",
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }
    })

    //addWindow.loadFile('add-user.html');
    addWindow.loadURL(`file://${__dirname}/add-user.html`);
}

ipcMain.on("todo:add", (event, todo) => {
    mainWindow.webContents.send("todo:add", todo);
    addWindow.close();
});

// Config MENU
const menuTemplate = [
    // { role: "appMenu" }
    ...(isMac ? [{
        label: app.name,
        submenu: [
            { role: "about" },
            { type: "separator" },
            { role: "services" },
            { type: "separator" },
            { role: "hide" },
            { role: "hideOthers" },
            { role: "unhide" },
            { type: "separator" },
            { role: "quit" }
        ]
    }] : []),
    // { role: "fileMenu" }
    {
        label: "File",
        submenu: [
            isMac ? { role: "close", accelerator: "Command+Q" } :
                {
                    label: "Créer utilisateur", accelerator: "Ctrl+U",
                    click() { createAddWindow(); }
                },
            { role: "quit", label: "Quitter", accelerator: "Ctrl+Q" }
        ]
    },
    // { role: "editMenu" }
    {
        label: "Edit",
        submenu: [
            { role: "undo" },
            { role: "redo" },
            { type: "separator" },
            { role: "cut" },
            { role: "copy" },
            { role: "paste" },
            ...(isMac ? [
                { role: "pasteAndMatchStyle" },
                { role: "delete" },
                { role: "selectAll" },
                { type: "separator" },
                {
                    label: "Speech",
                    submenu: [
                        { role: "startSpeaking" },
                        { role: "stopSpeaking" }
                    ]
                }
            ] : [
                { role: "delete" },
                { type: "separator" },
                { role: "selectAll" }
            ])
        ]
    },
    // { role: "viewMenu" }
    {
        label: "View",
        submenu: [
            { role: "reload" },
            { role: "forceReload" },
            { role: "toggleDevTools" },
            { type: "separator" },
            { role: "resetZoom" },
            { role: "zoomIn" },
            { role: "zoomOut" },
            { type: "separator" },
            { role: "togglefullscreen" }
        ]
    },
    // { role: "windowMenu" }
    {
        label: "Window",
        submenu: [
            { role: "minimize" },
            { role: "zoom" },
            ...(isMac ? [
                { type: "separator" },
                { role: "front" },
                { type: "separator" },
                { role: "window" }
            ] : [
                { role: "close" }
            ])
        ]
    },
    {
        role: "help",
        submenu: [
            {
                label: "Learn More",
                click: async () => {
                    const { shell } = require("electron")
                    await shell.openExternal("https://electronjs.org")
                }
            }
        ]
    }
]
