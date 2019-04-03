console.log('app.js');

fetch('./cats/all').then((response) => {
    return response.json();
}).then((json) => {
    console.log(json);
    json.forEach((cat) => {
        document.querySelector('#cats').innerHTML = `<li>${cat.name}</li>`;
    });
});