import Express from 'express';

import Db from './database/connections';
import ConvertHourToMinutes from './utils/convertHourToMinutes';

const routes = Express.Router();

interface ScheduleItem {
    week_day: Number,
    from: String,
    to: String
}

routes.post('/classes', async (request, response) => {
    const {
        name,
        avatar,
        whatsapp,
        bio,
        subject,
        cost,
        schedule
    } = request.body;

    const trx = await Db.transaction();

    try {
        const insertUsersIds = await trx('users').insert({
            name,
            avatar,
            whatsapp,
            bio
        });
    
        const user_id = insertUsersIds[0];
    
        const insertClassesIds = await trx('classes').insert({
            subject,
            cost,
            user_id 
        });
    
        const class_id = insertClassesIds[0];
    
        const classSchedule = schedule.map((scheduleItem: ScheduleItem) => {
            return {
                class_id,
                week_day: scheduleItem.week_day,
                from: ConvertHourToMinutes(scheduleItem.from),
                to: ConvertHourToMinutes(scheduleItem.to)
            };
        });
    
        await trx('class_schedule').insert(classSchedule);
    
        await trx.commit();
    
        return response.status(201).send();
    } catch(err) {
        await trx.rollback();

        return response.status(400).json({
            error: 'Unexpected error while creating new class'
        });
    }
});

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