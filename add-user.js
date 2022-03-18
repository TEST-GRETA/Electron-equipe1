document.querySelector("form").addEventListener("submit", event => {

    event.preventDefault();

    const { value } = document.querySelector("input");

    //console.log(value);
    api.send("todo:add", value);
})