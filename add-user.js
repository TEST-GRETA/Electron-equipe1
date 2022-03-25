let utilisateurs

btnvalider.onclick = valider;
btnannuler.onclick = annuler;


function valider(){
    // let nom = getElementById('nom');
    // let prenom = getElementById('prenom');
    // let date_naissance = getElementById('date_naissance');
    // let adresse = getElementById('adresse');
    // let telephone = getElementById('telephone');
    // let email = getElementById('email');
    // let num_secu = getElementById('num_secu');
    // let photo = getElementById('photo');

    // let newUtilisateur = {
    //     nom: nom,
    //     prenom: prenom,
    //     date_naissance: date_naissance,
    //     adresse: adresse,
    //     telephone: telephone,
    //     email: email,
    //     num_secu: num_secu,
    //     photo: photo
    // };

    // utilisateurs.push(newUtilisateur);

    api.send("todo:returnAdd", utilisateurs);


}




function annuler(){
    api.send("todo:returnAdd", utilisateurs);
}



var eleve = document.getElementById('eleve');
formDate = new FormData(eleve);


document.querySelector("form").addEventListener("submit", event => {
    const { value } = document.querySelector("input");

    //console.log(value);
    api.send("todo:add", value);
})