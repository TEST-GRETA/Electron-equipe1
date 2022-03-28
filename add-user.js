frmaddusers.onsubmit = function () {
    return valider();
};

/*btnvalider.onclick = function () {
    valider();
};*/

btnannuler.onclick = function () {
    annuler();
};

function valider() {

    let ztNom = document.getElementById('nom').value.trim();
    let ztPrenom = document.getElementById('prenom').value.trim();
    let ztDateNaissance = document.getElementById('date_naissance').value.trim();
    let ztAdresse = document.getElementById('adresse').value.trim();
    let ztTelephone = document.getElementById('telephone').value.trim();
    let ztEmail = document.getElementById('email').value.trim();
    let ztNumSecu = document.getElementById('num_secu').value.trim();
    let ztPhoto = document.getElementById('photo').value.trim();

    if (ztNom == ""
        || ztPrenom == ""
        || ztDateNaissance == ""
        || ztAdresse == ""
        || ztTelephone == ""
        || ztEmail == ""
        || ztNumSecu == ""
        || ztPhoto == ""
    ) {
        // un(des) champ(s) vide(s)
        alert("Attention, tous les champs sont obligatoires (espaces seulement exclu) !!!");
        return false;
    }
    else {
        let newUtilisateur =
        {
            "nom": ztNom,
            "prenom": ztPrenom,
            "date_naissance": ztDateNaissance,
            "adresse": ztAdresse,
            "telephone": ztTelephone,
            "email": ztEmail,
            "num_secu": ztNumSecu,
            "photo": ztPhoto
        };

        api.send("to:addvalider", newUtilisateur);
        return true;
    }
};

function annuler() {
    api.send("to:addannuler");
};
