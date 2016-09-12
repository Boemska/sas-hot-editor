 /*-------------------- writeTable.sas ---------------------
 |  Purpose: Write the data sent back from the frontend 
 |           to the specified SAS dataset
 *----------------------------------------------------------*/


%include "&h54slocation.";
    
* Get the library and table that were selected from the dropdowns ;
%hfsGetDataset(data,work.whichtable);

*check for errors in the above ;
%hfsErrorCheck;

* Get the actual data that was sent from the front end grid ;
%hfsGetDataset(tabledata,work.tabledata);

*check for errors again ;
%hfsErrorCheck;

* load the selected lib and memname into macros ;
data _null_;
 set whichtable;
 call symput('thelibname',libname);
 call symput('thememname',memname);
run;

* write the deserialised data as the table selected from the dropdowns ;
data &thelibname..&thememname.;
  set work.tabledata;
run;

* get the column metadata for the table that was just written ;
proc datasets lib=&thelibname. nolist;
  contents data=&thememname. out=work.descout(keep=name label type length);
run;

* output the table metadata and table data back to the front end to show what was written ;
%hfsHeader;
  %hfsOutDataset(columnspec, work, descout);
  %hfsOutDataset(tabledata, &thelibname, &thememname);
%hfsFooter;
