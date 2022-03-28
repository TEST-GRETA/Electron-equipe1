let oldObjetUtilisateur = null;
let idUtilisateurToModify = "0";

frmmodifyusers.onsubmit = function () {
    return valider();
};

btnannuler.onclick = function () {
    annuler();
};

function afficherDataUser() {
    //alert("show to modify : " + oldObjetUtilisateur.nom);
    const objetUtilisateur = oldObjetUtilisateur;

    document.getElementById('nom').value = objetUtilisateur.nom;
    document.getElementById('prenom').value = objetUtilisateur.prenom;
    document.getElementById('date_naissance').value = objetUtilisateur.date_naissance;
    document.getElementById('adresse').value = objetUtilisateur.adresse;
    document.getElementById('telephone').value = objetUtilisateur.telephone;
    document.getElementById('email').value = objetUtilisateur.email;
    document.getElementById('num_secu').value = objetUtilisateur.num_secu;
    document.getElementById('photo').value = objetUtilisateur.photo;
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
    } else if (ztNom == oldObjetUtilisateur.nom
        && ztPrenom == oldObjetUtilisateur.prenom
        && ztDateNaissance == oldObjetUtilisateur.date_naissance
        && ztAdresse == oldObjetUtilisateur.adresse
        && ztTelephone == oldObjetUtilisateur.telephone
        && ztEmail == oldObjetUtilisateur.email
        && ztNumSecu == oldObjetUtilisateur.num_secu
        && ztPhoto == oldObjetUtilisateur.photo
    ) {
        // aucune modification
        alert("Attention, aucune information n'a été modifiée pour cet utilisateur !!!");
        return false;
    } else {
        let modifyUtilisateur =
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

        let infosOk = [modifyUtilisateur, idUtilisateurToModify];

        api.send("to:modifyvalider", infosOk);
        return true;
    }
};

function annuler() {
    api.send("to:modifyannuler");
};

api.receive("to:modify", infos => {
    //alert("modify-recup-infos : " + infos[0][0].nom + "-" + infos[0][1]);
    const tabInfos = infos[0];
    const objetUtilisateur = tabInfos[0];

    oldObjetUtilisateur = objetUtilisateur;
    idUtilisateurToModify = tabInfos[1]
    afficherDataUser();
});
