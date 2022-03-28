btnretour.onclick = function () {
    retourner();
};

function retourner() {
    api.send("to:viewretour");
};

api.receive("to:view", viewUtilisateur => {
    //alert("view : " + viewUtilisateur[0].nom);
    const objetUtilisateur = viewUtilisateur[0];

    document.getElementById('nom').value = objetUtilisateur.nom;
    document.getElementById('prenom').value = objetUtilisateur.prenom;
    document.getElementById('date_naissance').value = objetUtilisateur.date_naissance;
    document.getElementById('adresse').value = objetUtilisateur.adresse;
    document.getElementById('telephone').value = objetUtilisateur.telephone;
    document.getElementById('email').value = objetUtilisateur.email;
    document.getElementById('num_secu').value = objetUtilisateur.num_secu;
    document.getElementById('photo').value = objetUtilisateur.photo;
});