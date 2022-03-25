var eleve = document.getElementById('eleve');
formDate = new FormData(eleve);


document.querySelector("form").addEventListener("submit", event => {
    const { value } = document.querySelector("input");

    //console.log(value);
    api.send("todo:add", value);
})