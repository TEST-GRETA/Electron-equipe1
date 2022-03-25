import { ipcRenderer } from 'electron';

let utilisateurs = []

// Récupération et affichage des données
api.receive(utilisateurs, function donneesFormProfil() {
    // Afficher les données dans les input:
    document.getElementById('ztNom').value = utilisateurs.nom;
    document.getElementById('ztPrenom').value = utilisateurs.prenom;
    document.getElementById('ztDate').value = utilisateurs.date_naissance;
    document.getElementById('ztAdresse').value = utilisateurs.adresse;
    document.getElementById('ztTel').value = utilisateurs.telephone;
    document.getElementById('ztEmail').value = utilisateurs.email;
    document.getElementById('ztSecu').value = utilisateurs.num_secu;
});


// Retour de données non modifier
document.getElementById("btnRetour").addEventListener("click", () => {
    // Données qui seront envoyées
    let profilUtilisateurs = {
        nom: document.getElementById("ztNom").value,
        prenom: document.getElementById("ztPrenom").value,
        date_naissance: document.getElementById("ztDate").value,
        adresse: document.getElementById("ztAdresse").value,
        telephone: document.getElementById("ztTel").value,
        email: document.getElementById("ztEmail").value,
        num_secu: document.getElementById("ztSecu").value
    };
    // Déclenche l'action de l'écouteur d'événement pour cet événement dans le processus de rendu et envoie les données
    ipcRenderer.send('todo:returnModify', profilUtilisateurs);
}, false);

// Envoie de données modifier
document.getElementById("btnValider").addEventListener("click", () => {
    // Données qui seront envoyées
    let profilUtilisateurs = {
        nom: document.getElementById("ztNom").value,
        prenom: document.getElementById("ztPrenom").value,
        date_naissance: document.getElementById("ztDate").value,
        adresse: document.getElementById("ztAdresse").value,
        telephone: document.getElementById("ztTel").value,
        email: document.getElementById("ztEmail").value,
        num_secu: document.getElementById("ztSecu").value
    };
    // Déclenche l'action de l'écouteur d'événement pour cet événement dans le processus de rendu et envoie les données
    ipcRenderer.send('todo:modify', profilUtilisateurs);
}, false);
