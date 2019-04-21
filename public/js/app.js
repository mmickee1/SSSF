console.log('app.js LAUNCHED');
fetch('./posts/allpics').then((response) => {
    console.log('I GOT SOME RESPONSE GG');
    return response.json();
}).then ((json) => {
   // console.log(json);
    json.forEach((file) => {
        // all infos from file list
        document.querySelector('#uploadinfos').innerHTML += `<li> 
                                                                  <ul>
                                                                    id: ${file._id} 
                                                                    <br>
                                                                    Category: ${file.category} 
                                                                    <br>
                                                                    Title: ${file.title} 
                                                                    <br>
                                                                    Description: ${file.description} 
                                                                    <br>
                                                                    Manufacturer: ${file.manufacturer}     
                                                                    <br>   
                                                                    Price: ${file.price}          
                                                                    <br>
                                                                    <img src="uploads/${file.imagename}">   
                                                                    <br>                                          
                                                                  </ul>
                                                               </li><br>`;
    });
});