console.log('app.js LAUNCHED');
fetch('./posts/allpics').then((response) => {
    console.log('I GOT SOME RESPONSE GG');
    return response.json();
}).then ((json) => {
    console.log(json);
    json.forEach((file) => {
        // all infos from file list
        document.querySelector('#uploadinfos').innerHTML += `<li> 
                                                                  <ul>
                                                                    ${file.manufacturer} 
                                                                    ${file.description}                                                                 
                                                                  </ul>
                                                               </li><br>`;
    });
});