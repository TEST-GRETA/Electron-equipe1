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
    createWindow();
    createAddWindow();
    createModifyWindow();
    createViewWindow();

    mainWindow.show();

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

// ### Page Création utilisateur
function createAddWindow() {
    addWindow = new BrowserWindow({
        frame: false,
        width: 600,
        height: 675,
        title: "Création utilisateur",
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }
    })

    addWindow.loadURL(`file://${__dirname}/add-user.html`);
    addWindow.setMenuBarVisibility(false);
    addWindow.setPosition(700, 35);
    addWindow.hide();
}

// ### Page Modification utilisateur
function createModifyWindow() {
    modifyWindow = new BrowserWindow({
        frame: false,
        width: 600,
        height: 675,
        title: "Modification utilisateur",
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }
    })
    modifyWindow.loadURL(`file://${__dirname}/modify-user.html`);
    modifyWindow.setMenuBarVisibility(false);
    modifyWindow.setPosition(700, 35);
    modifyWindow.hide();
}

// ### Page Detail utilisateur
function createViewWindow() {
    viewWindow = new BrowserWindow({
        frame: false,
        width: 600,
        height: 675,
        title: "Détail utilisateur",
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }
    })
    viewWindow.loadURL(`file://${__dirname}/view-user.html`);
    viewWindow.setMenuBarVisibility(false);
    viewWindow.setPosition(700, 35);
    viewWindow.hide();
}

ipcMain.on("to:add", (event) => {
    console.log("-> want to add");
    //createAddWindow();
    addWindow.show();
});
ipcMain.on("to:addannuler", (event) => {
    console.log("<- cancel add");
    addWindow.reload();
    addWindow.hide();
    mainWindow.show();
    //addWindow.close();
});
ipcMain.on("to:addvalider", (event, newUtilisateur) => {
    console.log("-> add : " + newUtilisateur.nom);
    mainWindow.webContents.send("to:addvalider", newUtilisateur);
    addWindow.hide();
    mainWindow.show();
    //addWindow.close();
});

ipcMain.on("to:modify", (event, infos) => {
    console.log("-> want to modify : " + infos[0].nom + "-" + infos[1]);
    //createModifyWindow();
    modifyWindow.webContents.send("to:modify", infos);
    modifyWindow.show();
});
ipcMain.on("to:modifyannuler", (event) => {
    console.log("<- cancel modify");
    modifyWindow.reload();
    modifyWindow.hide();
    mainWindow.show();
    //modifyWindow.close();
});
ipcMain.on("to:modifyvalider", (event, infos) => {
    console.log("-> modify : " + infos[0].nom + "-" + infos[1]);
    console.log(infos[0]);
    mainWindow.webContents.send("to:modifyvalider", infos);
    modifyWindow.hide();
    mainWindow.show();
    //modifyWindow.close();
});

ipcMain.on("to:view", (event, viewUtilisateur) => {
    console.log("-> view : " + viewUtilisateur.nom);
    //createViewWindow();
    viewWindow.webContents.send("to:view", viewUtilisateur);
    viewWindow.show();
});
ipcMain.on("to:viewretour", (event) => {
    console.log("<- return of view");
    viewWindow.reload();
    viewWindow.hide();
    mainWindow.show();
    //viewWindow.close();
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
                    click() { addWindow.show(); }
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
