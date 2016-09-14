 /*-------------------- deleteTable.sas --------------------
 |  Purpose: Get the details of a dataset chosen by the user
 |           from the dictionary tables and SQP drop it.  
 *----------------------------------------------------------*/

%include "&h54slocation.";

    
* Get the data that was sent and return the table ;

%hfsGetDataset(data,work.whichtable);
*check stuff;
%hfsErrorCheck;

* get the params ;
data _null_;
 set whichtable;
 call symput('thelibname',libname);
 call symput('thememname',memname);
run;

proc sql;
  drop table &thelibname..&thememname.;
quit;

%let usermessage=Table &thelibname..&thememname. deleted.;

%hfsHeader;
%hfsFooter;
