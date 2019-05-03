# SSSF
"Server side scripting frameworks" -school course, using web dev tool, express, node, mongodb etc



## APIDOC

### HOME

* `'/' - GET` - get all posts without authentication
* `'/home' - POST` - get all posts after authentication (can edit/delete them now)

#### User API

* `'/users/login' - GET` - get login page
* `'/users/login' - POST` - login with username and password
* `'/users/signup' - GET` - get signup page
* `'/users/signup' - POST` - create user with username and password
* `'/users/logout' - GET` - log out current user 

#### Post API

* `'/posts/allpics' - GET` - get all posts in json  
* `'/posts/add' - GET` - get page where items can be added
* `'/posts/delete/:id' - GET` - get page where you confirm deleting the post with certain id
* `'/posts/edit/:id' - GET` - get page where certain item can be edited
* `'/posts' - POST` - add new post 
* `'/posts' - PATCH` - edit post (id passed in body)
* `'/posts' - DELETE` - delete post (id passed in body)

#### Author Mikael Meinander