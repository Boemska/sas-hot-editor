# The SAS HOT Editor

## What is this?

A [H54S](https://github.com/Boemska/h54s)-based HTML5 Web Application for the [SAS® Intelligence Platorm™](http://www.sas.com/en_us/software/sas9.html) that lets end users easily edit, create and upload designated SAS datasets using a familiar spreadsheet-like interface with built in front-end validation:
<p align="center">
<img src="https://cloud.githubusercontent.com/assets/11962123/18225537/3b5b9844-71ec-11e6-8c4c-d66c786b47a2.gif" width="656" height="636">
</p>

## Who is it for?

SASHOT is designed to be an universal, easily customised app. It will be useful to anyone wanting to enable members of their organisation to easily view or edit centrally stored data in a controlled and secure manner, without the need to install any clients to their local machine.

Whether it's to quickly browse a library, update a control table, submit manual adjustments (by pasting data in from their excel workbook?)... you get the idea. If you've ever had a colleague look off into middle distance and perform an impromptu soliloquy on _the good old days of PROC FSEDIT_, feel free to show them this app.

## How does it work?

It uses the (excellent) [Handsontable JavaScript library](https://github.com/handsontable/handsontable) to provide spreadsheet-like editor functionality and the (excellent) [SAS Stored Process Web Application](http://support.sas.com/rnd/itech/doc9/dev_guide/stprocess/stpwebapp.html) to interact with the SAS Platform at the back end. The interaction between the two is managed by the [boemska html5 data adapter for sas](https://github.com/boemska/h54s).

If you're a SAS programmer wanting to understand how the app works, start by looking at the programs in the `sas/stp` directory while consulting the [H54S documentation](https://github.com/boemska/h54s#sas-api-reference). 

## What does it need?

##### Server
- Typically SAS 9.4 with SAS Integration Technologies and the STP Web App configured (ie. SAS Office Analytics). Earlier versions of SAS work fine but static content deployment is a bit more complicated than what is documented here. 

##### Client
- A modern browser. Chrome or Firefox recommended. IE11 works ok. 

##### Developer
- Standard dev tools such as [git](https://git-scm.com/), [npm](https://www.npmjs.com/) and [bower](https://bower.io/). See below.


## How do I get it?

As with the h54s Angular Seed App, you need to have [git](https://git-scm.com/), [npm](https://www.npmjs.com/) and [bower](https://bower.io/) installed. After that it's easy:

```bash
# Clone this project
git clone https://github.com/Boemska/sas-hot-editor.git

# Navigate to it
cd sas-hot-editor 

# Install the dependencies and build app and dist
npm install
```

If you really, really can't install the above tools or don't want to build the app yourself, you can just download `dist-prebuilt.zip` and `sas/spks/sashoteditor.spk` instead. This will let you easily deploy and run the app, but will make it more difficult to change and keep up-to-date. The former way really is better. 

## How do I deploy it?

Deployment is simple on SAS 9.4, requiring no special permissions or service interruptions. Building and deploying the app involves: 

- importing/registering the SAS content (by importing the included .spk)
- telling the STPs where the included H54S macros are located (by changing the Shared Prompt default value)
- configuring the Web App to point to the correct location in SAS metadata where content was imported (by editing `dist/h54sconfig.json`)
- deploying the Web App (by copying the `dist` directory to somewhere within `Lev1/Web/WebServer/htdocs`)

More detail on each step is provided below:

#### Deploy the SAS content 

##### Deploy the Stored Processes

The SAS Metadata objects (5 Stored Processes and a Shared Prompt) are contained within a standard sas .spk package, under `sas/spks/sashoteditor.spk`. Import this package into a Metadata location of your choice.

Alternatively if you prefer to register the Stored Processes yourself, the SAS code for each can be found under `sas/stps`. The registered objects should all reside in one Metadata directory, and their names should mirror the names of the files, without the .sas extension.

With either method you should end up with a Metadata directory resembling something like this:

![metadata](https://cloud.githubusercontent.com/assets/11962123/18432284/0da0dec0-78d9-11e6-884a-16d07ea2730f.png)

More info on the purpose of that `h54slocation` shared prompt in the next section.

##### Configure the H54S location 

The Stored Processes need to source the macros defined in `h54s.sas` to function. Copy `sas/includes/h54s.sas` to a location accessible by your Stored Process Server and set the default value of the `h54slocation` shared prompt to the full path of the `h54s.sas` file:

- Right click `h54slocation` -> _Properties_ -> Bottom left _Edit Prompt_ -> 2nd tab _Prompt Type and Values_ -> 2nd from bottom _Default Value_ 
- Change `/pub/apps/core/h54s.sas` to wherever you copied `h54s.sas`
 
This will enable the H54S macros are be sourced via the `%include "&h54slocation.";` statement present in each of the SAS programs. 

_Note: If you deployed your Stored Processes manually, you will need to pass the `&h54slocation.` var to your programs another way - ie. by setting the value in your STP Server autoexec, creating a **h54slocation** prompt for each of the Stored Processes, or creating it as a single Shared Prompt and attaching it to each of the 5 STPs._

The code is set up in this way for ease of deployment. If you're pushing this out to a couple of thousand users, consider storing / compiling / autocalling `h54s.sas` rather than having the code %included each time.

#### Deploy the Web App

##### Configure the Metadata location of deployed STPs

The H54S Adapter needs to know the Metadata location of the registered Stored Processes. This is configured by editing `dist/h54sconfig.json`, where `dist` resides in the root directory of your git repository (or where you unzipped the app). If you imported the .spk so that your STPs are located under `/Shared Data/Apps/tableEditor`, your `dist/h54config.json` file should look like this (note trailing slash):

```json
{
  "metadataRoot": "/Shared Data/Apps/tableEditor/",
  "debug": false
}
```

This is the most basic configuration and should suit most common SAS installations. For more information on available H54S configuration parameters, and how to configure it when your SASLogon or SASStoredProcess URIs are customised, have a look at the [H54S Javascript API Reference](https://github.com/Boemska/h54s#javascript-api-reference).

##### Deploy the Static Web App code to htdocs

SAS 9.4 comes with Pivotal Web Server (Apache 2.2.29) included. To deploy this Web app, copy the `dist/` directory to a subdirectory within `[SAS-Config]/[SAS-Lev]/Web/WebServer/htdocs`. If, for example, you copied `dist` to `htdocs/apps/sasEditor` (ie. so that `sasEditor` dir contains `h54sconfig.json` and `index.html`), this would make the App accessible via the URL `yourSasServer/apps/sasEditor/`. 

#### Test the app

As above, the app should now be accessible via `http(s)://yourSasServer:7980/theDirectoryYouCopiedItToInHtdocs/`, where yourSasServer and 7980 are the server and port number of your SAS Web Server. If you aren't already logged in to the SAS web apps, the app should ask you for your SAS username and password. This is a good sign. 

### Support

For simple stuff or feature ideas, raise an issue on GitHub and let's make it happen. For commercial support or custom development, drop us a line on info@boemskats.com.

