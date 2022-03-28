// Gestion bouton "Créer un nouvel utilisateur"
addButton.onclick = function () {
    api.send("to:add");
};

// id Utilisateur
let idUser = 0;
let currentIdUser = idUser.toString();

//Ajout de 2 Objets JSON dans la liste au démmarrage de l'application 
let initUtilisateurs = [
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

//Déclaration variable hors function
let listUtilisateurs = document.querySelector("tbody");

//Boucle de parcours de l'objet JSON
//Il est possible d'utiliser map ou forEach
initUtilisateurs.map(currentObjetUser => {

    let ajoutLigne = createNewLigne();
    createElementsForUtilisateur(ajoutLigne, currentObjetUser, currentIdUser, true);

});

function createNewLigne() {

    idUser += 1;
    currentIdUser = idUser.toString();

    let newLigne = document.createElement("tr");
    newLigne.id = "tr-" + currentIdUser;

    listUtilisateurs.appendChild(newLigne);

    return newLigne;
}

function createElementsForUtilisateur(maLigne, objetUtilisateur, theId, isCreation) {

    const dateNaissanceUser = objetUtilisateur.date_naissance;
    const ddDate = dateNaissanceUser.substr(8, 2);
    const mmDate = dateNaissanceUser.substr(5, 2);
    const yyyyDate = dateNaissanceUser.substr(0, 4);
    const dateNaissanceUserFormat = ddDate + "/" + mmDate + "/" + yyyyDate;

    if (isCreation == true) {
        let tdId = document.createElement("td");
        let textId = document.createTextNode(theId);
        tdId.appendChild(textId);
        maLigne.appendChild(tdId);
    }

    let tdNom = document.createElement("td");
    let textNom = document.createTextNode(objetUtilisateur.nom);
    let tdPrenom = document.createElement("td");
    let textPrenom = document.createTextNode(objetUtilisateur.prenom)
    let tdDateNaissance = document.createElement("td");
    let textDateNaissance = document.createTextNode(dateNaissanceUserFormat);
    let btns = document.createElement("td");
    let btnDetail = document.createElement("button");
    btnDetail.innerHTML = "Détails";
    btnDetail.type = "button";
    btnDetail.addEventListener("click", function () {
        //alert("Détail Utilisateur : " + theId);
        api.send("to:view", objetUtilisateur);
        api.send("to:viewgo", objetUtilisateur);
    });
    let btnModifier = document.createElement("button");
    btnModifier.innerHTML = "Modifier";
    btnModifier.type = "button";
    btnModifier.addEventListener("click", function () {
        //alert("Modifier Utilisateur *** : " + theId);
        let infos = [objetUtilisateur, theId];
        api.send("to:modify", infos);
    });
    let btnSupprimer = document.createElement("button");
    btnSupprimer.innerHTML = "Supprimer";
    btnSupprimer.type = "button";
    btnSupprimer.addEventListener("click", function () {
        //alert("Supprimer Utilisateur !!! : " + theId);
        // suppression ligne utilisateur
        let ligneToDelete = btnSupprimer.parentNode.parentNode;
        ligneToDelete.parentNode.removeChild(ligneToDelete);
    });

    tdNom.appendChild(textNom);
    tdPrenom.appendChild(textPrenom);
    tdDateNaissance.appendChild(textDateNaissance);
    btns.appendChild(btnDetail);
    btns.appendChild(btnModifier);
    btns.appendChild(btnSupprimer);

    maLigne.appendChild(tdNom);
    maLigne.appendChild(tdPrenom);
    maLigne.appendChild(tdDateNaissance);
    maLigne.appendChild(btns);
};

api.receive("to:addvalider", newUtilisateur => {
    //alert("add valider : " + newUtilisateur[0].nom);
    const addObjetUtilisateur = newUtilisateur[0];

    let newCreatedLigne = createNewLigne();
    createElementsForUtilisateur(newCreatedLigne, addObjetUtilisateur, currentIdUser, true);
});

api.receive("to:modifyvalider", infos => {
    //alert("modify-recup-infos-to-save : " + infos[0][0].nom + "-" + infos[0][1]);
    const tabInfos = infos[0];
    const newObjetUtilisateur = tabInfos[0];
    const idUtilisateurToModify = tabInfos[1]

    let ligneToModify = document.getElementById("tr-" + idUtilisateurToModify);

    //ligneToModify.innerHTML = "";
    //ligneToModify.textContent = "";
    //while (ligneToModify.firstChild) {

    for (let i = 0; i < 4; i++) {
        ligneToModify.removeChild(ligneToModify.lastChild);
    }

    createElementsForUtilisateur(ligneToModify, newObjetUtilisateur, idUtilisateurToModify, false)
});