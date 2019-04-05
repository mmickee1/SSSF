console.log('app.js');

fetch('./public/uploads/').then((response) => {
    return response.json();
}).then((json) => {
    console.log(json);
    json.forEach((pic) => {
        console.log('found a picture');
        document.querySelector('#pics').innerHTML = `<li>${pic}</li>`;
    });
});