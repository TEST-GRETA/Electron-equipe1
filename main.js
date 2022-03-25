const { app, BrowserWindow, Menu, ipcMain } = require("electron")

// include the Node.js 'path' module at the top of your file
const path = require("path")

// Test MAC
const isMac = process.platform === "darwin"

//X *** Déclaration collection des objets utilisateurs récupérés dans fichier JSON
//Xlet collectionUtilisateurs = require('./db.json');
//Xconsole.log(collectionUtilisateurs);

// *** Déclaration des 4 pages
let mainWindow;
let addWindow;
let modifyWindow;
let viewWindow;

// ### Page Principale avec liste des utilisateurs
const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }
    })

    mainWindow.loadFile("index.html");
    mainWindow.maximize();
}

app.whenReady().then(() => {
    createWindow()

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })

    //!isMac && mainWindow.on("closed", () => app.quit());

    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);
})

app.on("window-all-closed", () => {
    if (!isMac) app.quit()
})

// ### Page Création utilisateur
function createAddWindow() {
    addWindow = new BrowserWindow({
        width: 800,
        height: 600,
        title: "Création utilisateur",
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }
    })

    addWindow.loadURL(`file://${__dirname}/add-user.html`);
    addWindow.maximize();
}

// ### Page Modification utilisateur
function createModifyWindow() {
    modifyWindow = new BrowserWindow({
        width: 800,
        height: 600,
        title: "Modification utilisateur",
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }
    })

    modifyWindow.loadURL(`file://${__dirname}/modify-user.html`);
    addWindow.maximize();
}

// ### Page Detail utilisateur
function createViewWindow() {
    viewWindow = new BrowserWindow({
        width: 800,
        height: 600,
        title: "Détail utilisateur",
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }
    })

    viewWindow.loadURL(`file://${__dirname}/view-user.html`);
    viewWindow.maximize();
}

ipcMain.on("todo:add", (event, collectionUtilisateurs) => {
    createAddWindow();
    addWindow.webContents.send("todo:add", collectionUtilisateurs);
    mainWindow.close();
});

ipcMain.on("todo:modify", (event, info) => {
    createModifyWindow();
    modifyWindow.webContents.send("todo:modify", info);
    mainWindow.close();
});

ipcMain.on("todo:delete", (event, collectionUtilisateurs) => {
    mainWindow.close();
    createWindow();
    mainWindow.webContents.send("todo:delete", collectionUtilisateurs);
});

ipcMain.on("todo:view", (event, info) => {
    createViewWindow();
    viewWindow.webContents.send("todo:view", info);
    mainWindow.close();
});

ipcMain.on("todo:returnAdd", (event, collectionUtilisateurs) => {
    createWindow();
    mainWindow.webContents.send("todo:returnAdd", collectionUtilisateurs);
    addWindow.close();
});

ipcMain.on("todo:returnModify", (event, collectionUtilisateurs) => {
    createWindow();
    mainWindow.webContents.send("todo:returnModify", collectionUtilisateurs);
    modifyWindow.close();
});

ipcMain.on("todo:returnView", (event, collectionUtilisateurs) => {
    createWindow();
    mainWindow.webContents.send("todo:returnView", collectionUtilisateurs);
    viewWindow.close();
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
