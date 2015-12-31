# Boemska H54S + Angular Seed App 

## What is this?

This repository is an app skeleton for a typical Web Application built with AngularJS and powered by the [Boemska HTML5 Data Adapter for SAS](https://boemskats.com/h54s) (GitHub page [here](https://github.com/Boemska/h54s)). It is targeted at developers familiar with [AngularJS](https://angularjs.org/) (the Web Application Framework maintained by Google) and looking for a head start in developing applications that utilise the adapter to talk to their SAS Data Platform. 

This skeleton is based on the official AngularJS Seed App, with the addition of H54S and some example components, implemented to demonstrate some of the core features of H54S. 

## What core features of H54S are implemented?

H54S implements a few features intended to make H54S-based apps both easier to develop, and easier to support in a production environment once they have been deployed. The features implemented here are:

#### Activity Indicator

To enhance the UX, H54S provides hooks that allow you to easily implement an indication mechanism to let your users know when your app is talking to the back end. It is implemented here using an ngToast that appears in the top right whenever your app is communicating with SAS. It can be seen in action in most of the animations below.

-----------

#### SAS Logon Management

When an authentication token for the SAS Stored Process Web Application doesn't exist or has expired, the SPWA redirects all user requests to the SAS Logon Application. To avoid disruption in workflow and loss of application context, H54S handles these redirects in the background, by default queuing the any requests until successful reauthentication. An example of the Logon handling capability is implemented here using a modal:

![logon](https://cloud.githubusercontent.com/assets/11962123/12065492/3d35472a-afd0-11e5-86ce-edd2eded0207.gif)


-----------
#### User Message 

Another useful feature for developers is the ability to programmatically pass messages to your end users, directly from the SAS Server back end. This can be useful for communicating messages in a generic way, without implementing specific logic or modifying the application front end after deployment.

Setting this macro variable anywhere in your SAS code prior to the execution of the hfsOuts:

```sas
%let usermessage=Remember, the system is going down for maintenance later!;
```

will result in the message appearing, like this:

![usermessage](https://cloud.githubusercontent.com/assets/11962123/12065602/007c3d1e-afd2-11e5-918b-2d87f28e17b3.gif)


-----------
#### Log Message

Much like the User Message above, this is another mechanism for either communicating with your users, by means of keeping a client-side log of your application activity. Use can depend on your application. Here implemented as part of a Log Window, setting a logmessage as so:

```sas
%let logmessage=ORCL Debug: &nobs rows returned from table XYZ for user &_METAPERSON.;
```
will result in the message appearing in the Application Log window as so:

![logmessage](https://cloud.githubusercontent.com/assets/11962123/12065735/76a154be-afd4-11e5-97e6-0c431f8069c5.gif)


-----------
#### Debug Mode

One of the core features of H54S, aimed at both developers and SAS support teams, is the handling of te SAS Debug Mode. Here, it is implemented using a toggle button labelled Debug, next to the Show Log button in the top right of the application window. 
When running in Debug Mode, applications continue to behave normally. However, the debug information for each request to the server is recorded against a list in the Adapter, and the Java and SAS execution logs for each call are retrieved using the Debug Data tab in the Log Window. 

![debugmessage](https://cloud.githubusercontent.com/assets/11962123/12065802/b640a7ae-afd5-11e5-93d1-b6e19370167f.gif)


-----------
#### Failed Request tracking

Like a Debug Mode, but not. This feature records the logs for any requests to the SAS server that may have errored. Another feature for developers and support staff. Erroring requests appear in the Failed Requests tab, and the individual errors produced by SAS can be found in the SAS Errors tab (to save digging through the logs). This functionality is, by design, not available in Debug Mode.

-----------
## Getting started

### Prerequisites

You need:

- git (to clone the project)
- node.js, npm and bower (to install dependencies and run)

Familiarising yourself with H54S, by at least reading through the [H54S readme](https://github.com/Boemska/h54s), is highly recommended.

### Cloning the Project

To clone this project for development, do the following:

```shell
git clone https://github.com/Boemska/h54s-angular-seed-app
cd h54s-angular-seed-app
```

If you are just looking to start a new project using this as a skeleton and don't care about the commit history:

```shell
git clone --depth=1 https://github.com/Boemska/h54s-angular-seed-app myFirstApp
cd myFirstApp 
```


### Installing the Dependencies

Run `npm install`. Much like the original AngularJS seed app, this will also install the required bower components.

### Configuring H54S 

The instance of the adapter configured with this skeleton app is defined in `app/components/sasAdapter.js`. For a minimum working configuration, as per the [example on the H54S page](https://github.com/Boemska/h54s#html5-front-end), you will need to configure it by setting the SAS Server hostname in `app/h54sConfig.json`, along with any other properties that differ from the default H54S config object. 

By default, this instance of the adapter is configured to `useRemoteConfig: true`, meaning that the it will look at for the app/h54sConfig.json code for the overriding configuration object spec. The full H54S configuration object spec can be found on the [H54S API Reference](https://github.com/Boemska/h54s#javascript-api-reference).

### Running the Application

Run `npm run server` from the root directory of the project. This will create a temporary web server on port 8000 of your local machine, and serve the project files to your browser.

To enable your test application to talk to your SAS server successfully while developing, you will want to temporarily disable the enforcement of the Same-Origin Policy by your browser. This is described in more detail in the [HTML5 Front End section](https://github.com/Boemska/h54s#html5-front-end) of the H54S readme. 

After this has been done, opening <http://localhost:8000/> in your browser should load the configured skeleton project, and any changes you make should be reflected there.

#### Making the first call

The call you can see being made in animations above is defined under `app/view1/view1.js`. To have your application make a call to SAS when view1 is shown, uncomment the `call` method (lines 11 and 17), and change the programPath to wherever you defined the STP you would like to call. You will need to have created a basic H54S STP on your server for this to work. Something like this should suffice:

```sas
%include '/pub/wherever/you/put/h54s.sas';

%hfsHeader;   
%hfsFooter;
```

For more information on what this SAS code does, see the [H54S Github Page](https://github.com/Boemska/h54s). Any questions, come ask someone in the H54S Gitter channel ->  [![Join the chat at https://gitter.im/Boemska/h54s](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/Boemska/h54s?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

<div style="text-align:center; font-size:150%;"> Have fun! </div>
