 /*-------------------- getMemberDetails.sas ---------------
 |  Purpose: Get the details of a dataset chosen by the user
 |           from the dictionary tables and return them for 
 |           the info box to be populated
 *----------------------------------------------------------*/

*   load h54s   ;
%include "&h54slocation.";

* Deserialise sent data *memberDetails* into input work table *work.meminput*;
%hfsGetDataset(memberDetails,work.meminput);

* catch any problems with the decode ;
%hfsErrorCheck;

* get details for the chosen dataset, from dictionary tables this time ;
proc sql;
  create table memInfo as
  select 
    a.libname,
    a.memname,
    a.typemem as type,
    a.memlabel as description,
    a.crdate as dt_created,
    a.nobs,
    a.nvar
  from dictionary.tables a right join meminput b
  on a.libname = b.libname and a.memname = b.memname;
quit;

* setting a macro variable called usermessage will display a dismissable message at the front end ;
%*let usermessage=Excellent choice. Check out this user message.;

* output the *memInfo* work table as object memInfo ; 
%hfsheader;
  %hfsOutDataset(memInfo, work, memInfo);
%hfsFooter;

