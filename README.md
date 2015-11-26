# Angular seed app with h54s

### A starter project for AngularJS using h54s SAS adapter

This is an application skeleton based on the official AngularJS seed app with h54s adapter, login modal and debug log window


## Getting started

#### Prerequisites
You need git to clone the project, node.js, npm and bower to install dependencies and run.

#### Clone the project
```
git clone https://github.com/Boemska/h54s-angular-seed-app
cd h54s-angular-seed-app
```

#### Install Dependencies
Run `npm install`. It will also install bower components.

#### Configure your new project
You have to edit hostUrl in `app/components/sasAdapter.js` on line 5. This is your host url where SAS is installed and running.
E.G. `http://example.com/`

More information on https://github.com/Boemska/h54s

#### Run the Application
Run `npm run server`. It will create web server and serve your files.

Now open <http://localhost:8000/> in your browser
