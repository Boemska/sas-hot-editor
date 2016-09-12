/*----------------startupService.sas ------------
  This service returns the data needed  
  by the table editor app on startup. 
  This includes the libraries and the 
  tables that a particular user should
  be able to access.
 *---------------------------------------------*/

*   load h54s   ;
%include "&h54slocation.";

* get a list of tables to be shown in the dropdowns. 
  This can be customised for user-dependent table lists;
proc sql;
  create table libsmems as
    select distinct libname, memname
    from dictionary.tables;
quit;

* output the list of tables as object *libsmems* ;
%hfsheader;
  %hfsOutDataset(libsmems, work, libsmems);
%hfsFooter;

