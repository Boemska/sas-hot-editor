# The SAS HOT Editor

## What is this?

A HTML5 Web Application for the [SAS® Intelligence Platorm™](http://www.sas.com/en_us/software/sas9.html) that lets SAS users easily create, edit and upload SAS datasets using a familiar spreadsheet-like interface with decent front-end validation:
<p align="center">
<img src="https://cloud.githubusercontent.com/assets/11962123/18225537/3b5b9844-71ec-11e6-8c4c-d66c786b47a2.gif" width="656" height="636">
</p>

## Who is it for?

Anyone wishing to let members of their organisation view or edit datasets on the server in a controlled and secure manner, without needing to install anything to their local machine. Whether you want to let them browse a library, update a control table, submit manual adjustments by pasting data in from excel, even submit timesheets... you get the idea. If you've ever had a colleague look off into middle distance and perform an impromptu soliloquy on _the good old days of PROC FSEDIT_, feel free to show them this app.

## How does it work?

It uses the (excellent) [Handsontable JavaScript library](http://www.sas.com/en_us/software/sas9.html) to provide spreadsheet-like editor functionality, and the (excellent) [SAS Stored Process Web Application](http://support.sas.com/rnd/itech/doc9/dev_guide/stprocess/stpwebapp.html) to interact with the SAS Platform back-end. The interaction between the two is managed by the [Boemska HTML5 Data Adapter for SAS](github.com/Boemska/h54s).

To understand the mechanics of the app, start with the SAS programs in the `sas/` directory. 

## How do I get it?

As with the h54s Angular Seed App, you need to install [npm](https://www.npmjs.com/), and then [bower](https://bower.io/). After that it's easy:

```bash
# Clone this project
git clone https://github.com/Boemska/sas-hot-editor.git

# Navigate to it
cd sas-hot-editor 

# Install the dependencies and build app/
npm install
```

## How do I deploy it?

Deployment is simple on SAS 9.4, requiring no special permissions or service interruptions. It generally involves three steps: 

- importing/registering the SAS content 
- copying over the static Web content 
- telling the latter where the former was imported/registered.

##### Deploy the SAS content 

The SAS components (mostly STPs) are contained within a standard sas .spk package, under `build/spks/stps.spk`. Alternatively, the SAS code for each STP is under `sas/` (if you prefer not to import foreign SPKs). Either way, import or register the STPs via SAS Management Console to a Metadata location of your choice.  


##### Deploy the static content to the SAS Web Server

SAS 9.4 comes bundled with Pivotal Web Server (Apache 2.2.29). To deploy the static Web content for this app, either unzip the included ./build/web/webapp.zip in to a subdirectory of `[SAS-Config]/[SAS-Lev]/Web/WebServer/htdocs`. or copy the ./app directory of the built app to the same location. It's best to rename the app directory to something more suitable.

##### Configure the Metadata location of deployed STPs

If, for example, you deployed the .spk so that youre STPs are located under /Shared Data/Apps/TableEditor, your app/h54config.json should look like this (note trailing slash):

```json
{                                                                                                                                                           
  "metadataRoot": "/Apps/tableEditor/",
  "debug": false
}
```

For more information on the configuration parameters that the adapter will accept here, have a look at the [H54S Javascript API Reference](https://github.com/Boemska/h54s#javascript-api-reference).

##### Test the app

The app should then be accessible via ` http(s)://yourSasServer/theDirectoryYouCopiedItToInHtdocs/`

### Wow, this is awesome. Can you customise this for me? Can you build me an app?

Sure. For simple stuff, raise an issue on GitHub. For commercials and support, drop us a line on info@boemskats.com.
