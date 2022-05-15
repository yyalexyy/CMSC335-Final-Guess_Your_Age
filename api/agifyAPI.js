const fetch = require('node-fetch');

async function getName() {
    let name = document.querySelector("#fname");

    await fetch(`https://api.agify.io?name=${name}`)
        .then(response => response.json())
        .then(json => console.log(json))
        .catch(error => console.log("Error: " + error));
}
