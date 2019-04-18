console.log('app.js LAUNCHED');
fetch('/posts/allpics').then((response) => {
    console.log('I GOT SOME RESPONSE GG');
    return response.json();
}).then ((json) => {
    console.log(json);
    json.forEach((file) => {
        // all infos from file list
        document.querySelector('#pics').innerHTML += `<li> 
                                                                  <ul>
                                                                    ${file.title} 
                                                                    ${file.description} 
                                                                    ${file.category} 
                                                                    ${file.location} 
                                                                    ${file.image}
                                                                  </ul>
                                                               </li><br>`;
    });
});