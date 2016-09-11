 /*-------------------- getTable.sas ------- -----
 |  Purpose: Return the data of a dataset that
 |           has been requested and pass it 
 |           verbatim to the frontend.
 *-----------------------------------------------*/

%include "&h54slocation.";

* Deserialise sent data *data* into input work table *work.whichtable*;
%hfsGetDataset(data,work.whichtable);

* catch any problems with the decode ;
%hfsErrorCheck;

* read the parameters from input table into macro vars ;
data _null_;
  set whichtable;
  call symput('thelibname',libname);
  call symput('thememname',memname);
run;

* put metadata of the chosen dataset into table *work.descout*;
proc datasets lib=&thelibname. nolist;
  contents data=&thememname. out=work.descout(keep=name label type length);
run;

* output the selected table metadata as object *columnspec* and the data itself as *tabledata*;
%hfsHeader;
  %hfsOutDataset(columnspec, work, descout);
  %hfsOutDataset(tabledata, &thelibname, &thememname);
%hfsFooter;
