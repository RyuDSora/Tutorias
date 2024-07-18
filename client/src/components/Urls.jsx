
const PuertoBackend = ''; 
//var origin = window.location.origin;
//var partes = origin.split(":");
var originS = 'https://server-xi-five-11.vercel.app';//partes[0] + ":" + partes[1];

//const PuertoBackend = ':8000'; //en caso de no usar puerto dejar esta constante vacia 

//var originS = partes[0] + ":" + partes[1];
const url = originS + PuertoBackend;

//urls para trabajar con tablas en general
export const URIaddTables    = url  + '/tables/create-table/';  //crear una tabla en especifico
export const URIcheckTables  = url  + '/tables/check-table/';   //verificar si una tabla ya esxiste
export const URIgetTables    = url  + '/tables/get-tables/';    //ver todas las tablas
export const URIdropTables   = url  + '/tables/drop-table/';    //eliminar una tabla
export const URIUpdateTables = url  + '/tables/update-table/';  //actualizar una tabla

