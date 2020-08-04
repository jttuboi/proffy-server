import Express from 'express';

import ClassesController from './controllers/ClassesController';

const routes = Express.Router();

const classesControllers = new ClassesController();

routes.post('/classes', classesControllers.create);

export default routes;


// GET: search or list an information
// POST: create a new information
// PUT: update an information
// DELETE: delete an information

// Insomnia Core is a software to test post, put and delete requests
// insomnia.rest

// request body: data for create or update of an information
// route params: identify which resource I want to update or delete
// query params: pagination, filters, sort

//// http://localhost:3333/users/
//// http://localhost:3333/users?page=2&sort=name
//app.get('/users', (request, response) => {
//    console.log(request.query);
//    console.log("get");
//    return response.send('hello')
//});
//
//// http://localhost:3333/users/
//app.post('/users', (request, response) => {
//    console.log("post");
//    console.log(request.body);
//
//    return response.json({ "user1": "pato", "user2": "gato" })
//});
//
//// http://localhost:3333/users/1
//app.delete('/users/:id', (request, response) => {
//    console.log("delete");
//    console.log(request.params);
//});

// listen http requests in the door 3333
// example: www.site.com:80
// http://localhost:3333