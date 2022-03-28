const { app, BrowserWindow, Menu, ipcMain } = require("electron")

// include the Node.js 'path' module at the top of your file
const path = require("path")

// Test MAC
const isMac = process.platform === "darwin"

//X *** Déclaration collection des objets utilisateurs au format JSON
//Ajout de 2 Objets JSON dans la liste au démarrage de l'application 
const initUtilisateurs = [
    {
        "nom": "DUPONT",
        "prenom": "Antoine",
        "date_naissance": "1992-07-26",
        "adresse": "24 chemin des Tantalas 31000 TOULOUSE",
        "telephone": "06-12-34-56-78",
        "email": "adupont@gmail.com",
        "num_secu": "0159632587418",
        "photo": "apphoto.jpg"
    },
    {
        "nom": "DESCHAMPS",
        "prenom": "Didier",
        "date_naissance": "1970-07-28",
        "adresse": "45 rue du Pré 75000 PARIS",
        "telephone": "09-14-37-86-78",
        "email": "dd@laposte.net",
        "num_secu": "0789632587457",
        "photo": "ddphoto.jpg"
    }
];

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
};

app.whenReady().then(() => {

    createWindow();
    mainWindow.on("ready-to-show", () => {
        console.log("-> init data");
        mainWindow.webContents.send("to:initdata", initUtilisateurs);
    });

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })

    !isMac && mainWindow.on("closed", () => app.quit());

    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);
});

app.on("window-all-closed", () => {
    if (!isMac) app.quit()
});

// ### Page Création utilisateur
function createAddWindow() {
    addWindow = new BrowserWindow({
        width: 600,
        height: 675,
        title: "Création utilisateur",
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }
    })

    addWindow.loadURL(`file://${__dirname}/add-user.html`);
    addWindow.setPosition(700, 35);
};

// ### Page Modification utilisateur
function createModifyWindow() {
    modifyWindow = new BrowserWindow({
        width: 600,
        height: 675,
        title: "Modification utilisateur",
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }
    })
    modifyWindow.loadURL(`file://${__dirname}/modify-user.html`);
    modifyWindow.setPosition(700, 35);
};

// ### Page Detail utilisateur
function createViewWindow() {
    viewWindow = new BrowserWindow({
        width: 600,
        height: 675,
        title: "Détail utilisateur",
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }
    })
    viewWindow.loadURL(`file://${__dirname}/view-user.html`);
    viewWindow.setPosition(700, 35);
};

ipcMain.on("to:add", (event) => {
    console.log("-> want to add");
    createAddWindow();
});
ipcMain.on("to:addannuler", (event) => {
    console.log("<- cancel add");
    addWindow.close();
});
ipcMain.on("to:addvalider", (event, newUtilisateur) => {
    console.log("-> add : " + newUtilisateur.nom);
    mainWindow.webContents.send("to:addvalider", newUtilisateur);
    addWindow.close();
});

ipcMain.on("to:modify", (event, infos) => {
    console.log("-> want to modify : " + infos[0].nom + "-" + infos[1]);
    createModifyWindow();
    modifyWindow.on("ready-to-show", () => {
        modifyWindow.webContents.send("to:modify", infos);
    });
});
ipcMain.on("to:modifyannuler", (event) => {
    console.log("<- cancel modify");
    modifyWindow.close();
});
ipcMain.on("to:modifyvalider", (event, infos) => {
    console.log("-> modify : " + infos[0].nom + "-" + infos[1]);
    console.log(infos[0]);
    mainWindow.webContents.send("to:modifyvalider", infos);
    modifyWindow.close();
});

ipcMain.on("to:view", (event, viewUtilisateur) => {
    console.log("-> view : " + viewUtilisateur.nom);
    createViewWindow();
    viewWindow.on("ready-to-show", () => {
        viewWindow.webContents.send("to:view", viewUtilisateur);
    });
});
ipcMain.on("to:viewretour", (event) => {
    console.log("<- return of view");
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
];
