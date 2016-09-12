# The SAS HOT Editor

## What is this?

A HTML5 Web Application for the [SAS® Intelligence Platorm™](http://www.sas.com/en_us/software/sas9.html) that lets SAS users easily edit, create and upload SAS datasets using a familiar spreadsheet-like interface with built in front-end validation:
<p align="center">
<img src="https://cloud.githubusercontent.com/assets/11962123/18225537/3b5b9844-71ec-11e6-8c4c-d66c786b47a2.gif" width="656" height="636">
</p>

## Who is it for?

SASHOT is designed to be an universal, customisable app, and will be useful to anyone needing to enable members of their organisation to easily view or edit remote data in a controlled and secure manner (without the need to install any clients to their local machine). 

Whether it's to quickly browse a library, update a control table, submit manual adjustments (by pasting data in from their excel workbook?)... you get the idea. If you've ever had a colleague look off into middle distance and perform an impromptu soliloquy on _the good old days of PROC FSEDIT_, feel free to show them this app.

## How does it work?

It uses the (excellent) [Handsontable JavaScript library](https://github.com/handsontable/handsontable) to provide spreadsheet-like editor functionality, and the (excellent) [SAS Stored Process Web Application](http://support.sas.com/rnd/itech/doc9/dev_guide/stprocess/stpwebapp.html) to interact with the SAS Platform at the back end. The interaction between the two is managed by the [Boemska HTML5 Data Adapter for SAS](github.com/Boemska/h54s).

If you're a SAS programmer wanting to understand how the app works, start with the SAS programs in the `sas/` directory. 

## How do I get it?

As with the h54s Angular Seed App, you need to have [npm](https://www.npmjs.com/), and [bower](https://bower.io/) installed. After that it's easy:

```bash
# Clone this project
git clone https://github.com/Boemska/sas-hot-editor.git

# Navigate to it
cd sas-hot-editor 

# Install the dependencies and build app and dist
npm install
```

## How do I deploy it?

Deployment is simple on SAS 9.4, requiring no special permissions or service interruptions. Building and deploying involves: 

- importing/registering the SAS content (importing the .spk)
- telling the STPs where the included H54S macros are located (editing the Shared Prompt default value)
- configuring the Web App to point to the location in SAS metadata where content was imported (editing h54sconfig.json)
- copying the static Web App files to `Lev1/Web/WebServer/htdocs`

##### Deploy the SAS content 

###### Deploy the STPs

The SAS components (5 Stored Processes and a Shared Prompt) are contained within a standard sas .spk package, under `sas/spks/sashoteditor.spk`. Alternatively, if you prefer to register the STPs yourself, the SAS code for each STP is under `sas/stps`. Either way, import .spk or register the STPs via SAS Management Console to a SAS Metadata location of your choice.

###### Configure the H54S location 

The STPs need to source the macros defined in `h54s.sas` to function. Copy `sas/includes/h54s.sas` to a location accessible by your Stored Process Server and set the value of the `h54slocation` shared prompt to the full path of the `h54s.sas` file. This will enable the H54S macros are be sourced via the `%include "&h54slocation.";` statement present in each of the SAS programs. 

The code is set up in this way for ease of deployment. If you're pushing this out to a couple of thousand users, consider storing / compiling / autocalling `h54s.sas` rather than having it included each time.

##### Deploy the Web App

###### Configure the Metadata location of deployed STPs

The Adapter needs to know where the app's STPs are located in SAS Metadata (the folder where `startupService` is located). This is configured by editing `dist/h54sconfig.json`. If you deployed the .spk so that your STPs are located under /Shared Data/Apps/tableEditor, your `dist/h54config.json` should look like this (note trailing slash):

```json
{
  "metadataRoot": "/Shared Data/Apps/tableEditor/",
  "debug": false
}
```

This is the most basic configuration which should suit most SAS installs. For more information on available H54S configuration parameters (eg. how to configure it when your SASLogon or SASStoredProcess apps are called something else) have a look at the [H54S Javascript API Reference](https://github.com/Boemska/h54s#javascript-api-reference).


###### Deploy the Static Web App code to htdocs

SAS 9.4 comes with Pivotal Web Server (Apache 2.2.29) included. To deploy this Web app, copy the `dist/` directory to a subdirectory within `[SAS-Config]/[SAS-Lev]/Web/WebServer/htdocs`. If, for example, you copied `dist` to `htdocs/apps/sasEditor` (ie. so that `sasEditor` dir contains `h54sconfig.json` and `index.html`), this would make the App accessible via the URL `yourSasServer/apps/sasEditor/`. 

##### Test the app

As above, the app should now be accessible via `http(s)://yourSasServer:7980/theDirectoryYouCopiedItToInHtdocs/`, where yourSasServer and 7980 are the server and port number of your SAS deployment. If you aren't already logged in to the SAS web apps, it will ask you for your username and password. 

### Support

For simple stuff or feature ideas, raise an issue on GitHub and let's make it happen. For commercial support or custom development, drop us a line on info@boemskats.com.

