# kodeprojectfront

Installation procedure

1. Clone the repository to a convinient location
2. This project was designed using Node (version: v6.9.4) and Node package manager (version: 3.10.10). To avoid any code breaks, make sure the same versions are installed. 
3. Run "bower install" and "npm install" to install all the dependencies that are required.
4. The project was designed in gulp. So make sure gulp is installed as a global module (npm install gulp -g).
5. Go to the location where gulpfile.js is located and run "gulp watch" to start the project (Note: this should be started only after the MongoDB service and backend services are started.)
6. Note: CORS plugin may be required for Cross Origin Resource Compatibility. Make sure to install the chrome plugin for CORS and enable the same on the chrome browser.