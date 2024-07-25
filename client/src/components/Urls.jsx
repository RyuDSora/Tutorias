
const PuertoBackend = ''; 
//var origin = window.location.origin;
//var partes = origin.split(":");
var originS = 'https://tutorias-five.vercel.app';//partes[0] + ":" + partes[1];

//const PuertoBackend = ':8000'; //en caso de no usar puerto dejar esta constante vacia 

//var originS = partes[0] + ":" + partes[1];
const url = originS + PuertoBackend;

//urls para trabajar con tablas en general
export const URIgetTablesColumns = url + '/tables/get-tables-columns';
export const URIaddTables    = url  + '/tables/create-table/';  //crear una tabla en especifico
export const URIcheckTables  = url  + '/tables/check-table/';   //verificar si una tabla ya esxiste
export const URIgetTables    = url  + '/tables/get-tables/';    //ver todas las tablas
export const URIdropTables   = url  + '/tables/drop-table/';    //eliminar una tabla
export const URIUpdateTables = url  + '/tables/update-table/';  //actualizar una tabla


export const URUsql          = url  + '/sql/execute';     

//user
export const urilogin = url + '/users/login';
export const uriregister = url + '/users/register';
export const URIUser = url + '/users/';

//cursos
export const UriCursos = url + '/subjects';

//tutor
export const uritutor = url + '/teachers';

//tutorsubject
export const uritutorsubject = url + '/tutorsubject'