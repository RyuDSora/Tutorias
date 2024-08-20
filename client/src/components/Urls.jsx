//export const url = 'http://localhost:3000';               //para hacer pruebas en local
export const url = 'https://tutorias-five.vercel.app';  //servidor de vercel


//urls para trabajar con tablas en general
export const URIgetTables    = url  + '/tables/get-tables/';    //ver todas las tablas
export const URUsql          = url  + '/sql/execute';     

//user
export const urilogin = url + '/users/login';
export const uriregister = url + '/users/register';
export const URIUser = url + '/users/';

//materias
export const UriCursos = url + '/subjects';

//lecciones
export const UriLesson = url + '/classes'

//tutor
export const uritutor = url + '/teachers';

//Create Event
export const createEventEndpoint = url + '/create-event';

//tutorsubject
export const uritutorsubject = url + '/ts';

//Estudiante-Cursos
export const uriestudisubject = url + '/estudisub';

//chats
export const urichat = url + '/api/messages';

//suscripciones
export const URLsuscription = url + '/suscription';

//google
export const urigoogle = url + '/apigoogle';
export const googleAuth = urigoogle+'/auth'

///oauth

export const UriOauth = url + '/oauth'

//planes
export const uriplanes = url + '/planes'


//estudiante x classes
export const uriestudiclasses = url + '/estclases'