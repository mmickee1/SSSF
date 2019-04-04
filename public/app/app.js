console.log('app.js');

fetch('./uploads/').then((response) => {
    return response.json();
}).then((json) => {
    console.log(json);
    json.forEach((pic) => {
        document.querySelector('#pics').innerHTML = `<li>${pic.title}</li>`;
    });
});