
const PuertoBackend = ''; 
//var origin = window.location.origin;
//var partes = origin.split(":");
var originS = 'https://tutorias-five.vercel.app';//partes[0] + ":" + partes[1];

//const PuertoBackend = ':8000'; //en caso de no usar puerto dejar esta constante vacia 

//var originS = partes[0] + ":" + partes[1];
export const url = originS + PuertoBackend;

//urls para trabajar con tablas en general
export const URIgetTables    = url  + '/tables/get-tables/';    //ver todas las tablas
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
export const uritutorsubject = url + '/ts';

//chats
export const urichat = url + '/api/messages';