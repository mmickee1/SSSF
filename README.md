# SSSF
"Server side scripting frameworks" -school course, using web dev tool, express, node, mongodb etc


week 3: 

-Ensure HTTP methods are used according to REST principles
-Update stored data
-Delete stored data and files
-Search entries by some property
-Authentication
	-https redirection
	-e.g. multiple users who need to login
		-at least one user (e.g. local strategy .env)
		-files belong to a single user
-Convert your front-end HTML to pug (or other template engine)
-Security:
	-Helmet, search for vulnerabilities and fix them


Questions: 

### Task 1: Cloud computing 

Answer to the following questions:

* What are the specs for one cloudlet unit? (CPU, Memory,  Storage)
- 1 cloudlet = 400MHz of CPU + 128MiB of Ram.
* What is vertical scaling?
- Changing the amount of allocated server resources (RAM and CPU).
* What is horizontal scaling?
- Changing the number of web/application server nodes in the environment.
* What is the (max) cost for 1 (small) cloudlet running for 30 days? 
- one website says 5€.
* When Node.js is deployed, what happens to the dependencies defined in package.json?
- After the application has been deployed, the npm install command is used to parse the package.json file and install all the dependencies listed.

---

### Task 2: Deployment from Git

* Imagine that your Node.js server will be deployed from a **public Git repository**.
* In your app, you have to customize server configuration, e.g.
  * admin username & password
  * database URL
  * email address for the contact person

Answer to the following question:

List different ways how you can *configure* or *setup* your own server configuration to the deployed service.

(Hint: I can imagine at least three different ways for that)


- use of ".env" files. environment files are in .gitignore and are not pushed to github. Good way to save important usernames for example.
- using Databases, such as MongoDB



---

### Task 3: Project demo

* Create a Mockup or a first prototype of your project idea
  * Have at least one endpoint on the server which returns some (JSON?) data back
  * Have a static HTML that shows the data 
  * Your HTML page should somehow present the **core idea of your project**
* Return the link to your project + node.js source code
* **In case Jelastic resources are not available, just retrun the link to your Github project**

