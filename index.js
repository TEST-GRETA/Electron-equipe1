//Objet JSON pour test
let utilisateurs = [
    {
        nom: "Tribal",
        prenom: "Djidji",
        date_naissance: "26/07/1992",
        adresse: "24 chemin des Tantalas",
        telephone: "0612345678",
        email: "djiTrib@titi.com",
        num_secu: "0159632587419",
        photo: "je ne sais pas"
    },
    {
        nom: "Tol",
        prenom: "Djidji",
        date_naissance: "26/07/1992",
        adresse: "24 chemin des Tantalas",
        telephone: "0612345678",
        email: "djiTrib@titi.com",
        num_secu: "0159632587419",
        photo: "je ne sais pas"
    }
]

//Déclaration variable hors function
let list = document.querySelector("tbody");

afficherTableau();

api.receive("todo:returnAdd", colUserz => {
    rechargementTableau(colUserz);
});

api.receive("todo:returnModify", colUserz => {
    rechargementTableau(colUserz);
});

api.receive("todo:returnView", colUserz => {
    rechargementTableau(colUserz);
});

function rechargementTableau(collection){
    utilisateurs = collection;
    list.empty();
    afficherTableau();
}

function afficherTableau(){

    //Boucle de parcours de l'objet JSON
    //Il est possible d'utiliser map ou forEach
    utilisateurs.map(currentUser => {

        let indexUser = utilisateurs.indexOf(currentUser);

        let ajoutLigne = document.createElement("tr");
        let tdNom = document.createElement("td");
        let textNom = document.createTextNode(currentUser.nom);
        let tdPrenom = document.createElement("td");
        let textPrenom = document.createTextNode(currentUser.prenom)
        let tdDateNaissance = document.createElement("td");
        let textDateNaissance = document.createTextNode(currentUser.date_naissance);
        let btns = document.createElement("td");
        let btnDetail = document.createElement("button");
        btnDetail.innerHTML = "Détails";
        btnDetail.type = "button";
        btnDetail.addEventListener("click", function(){
            let info = [utilisateurs, indexUser];
            api.send("todo:view", info);
        });
        let btnModifier = document.createElement("button");
        btnModifier.innerHTML = "Modifier";
        btnModifier.type = "button";
        btnModifier.addEventListener("click", function(){
            let info = [utilisateurs, indexUser];
            api.send("todo:modify", info);
        });
        let btnSupprimer = document.createElement("button");
        btnSupprimer.innerHTML = "Supprimer";
        btnSupprimer.type = "button";
        btnSupprimer.addEventListener("click", function(){
            utilisateurs.splice(indexUser, 1);
            alert(utilisateurs);
            api.send("todo:delete", utilisateurs);
        });

        tdNom.appendChild(textNom);
        tdPrenom.appendChild(textPrenom);
        tdDateNaissance.appendChild(textDateNaissance);
        btns.appendChild(btnDetail);
        btns.appendChild(btnModifier);
        btns.appendChild(btnSupprimer);

        list.appendChild(ajoutLigne);

        ajoutLigne.appendChild(tdNom);
        ajoutLigne.appendChild(tdPrenom);
        ajoutLigne.appendChild(tdDateNaissance);
        ajoutLigne.appendChild(btns);
    });
}

addButton.onclick = function(){
    api.send("todo:add", utilisateurs);
};