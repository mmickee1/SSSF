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
                                                                    Seller: ${file.uploader} 
                                                                    <br>
                                                                    Category: ${file.category} 
                                                                    <br>
                                                                    Title: ${file.title} 
                                                                    <br>
                                                                    Description: ${file.description} 
                                                                    <br>
                                                                    Manufacturer: ${file.manufacturer}     
                                                                    <br>   
                                                                    Price: ${file.price} €          
                                                                    <br>
                                                                    <img src="uploads/${file.imagename}">   
                                                                    <br>
                                                                    <a href="/posts/edit/${file._id}"><button type="button">Edit</button></a>
                                                                    <a href="/posts/delete/${file._id}"><button type="button">Delete</button></a>                                        
                                                                  </ul>
                                                               </li><br>`;
    });
});