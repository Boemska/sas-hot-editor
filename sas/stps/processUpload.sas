 /*---------- processUpload.sas -----------------
 |  Purpose: Process an uploaded spreadsheet that
 |           a user sent over. 
 *-----------------------------------------------*/

%include "&h54slocation.";

* the uploaded file will be _WEBIN_FILEREF;
%let XLSFILE=%sysfunc(pathname(&_WEBIN_FILEREF));

* generic proc import step. This is the magic ;
PROC IMPORT OUT=sendmeback DATAFILE="&XLSFILE." DBMS=xls REPLACE;
  GETNAMES=YES;
RUN;

* Get the data that was sent and return the table ;
%let thememname=sendmeback;

* Get table structure of new data for the *columnspec* object ;
proc datasets lib=work. nolist;
  contents data=sendmeback out=work.descout(keep=name label type length);
run;

* as with getTable, output the metadata table as *columnspec* object and actual data as *tabledata* ;
%hfsHeader;
  %hfsOutDataset(columnspec, work, descout);
  %hfsOutDataset(tabledata, work, sendmeback);
%hfsFooter;
