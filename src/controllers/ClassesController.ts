import { Request, Response } from 'express';

import Db from '../database/connections';
import ConvertHourToMinutes from '../utils/convertHourToMinutes';

interface ScheduleItem {
    week_day: Number,
    from: String,
    to: String
}

export default class ClassesController {
    async create(request: Request, response: Response) {
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
    }

    async index(request: Request, response: Response) {
        const filters = request.query;

        const subject = filters.subject as string;
        const week_day = filters.week_day as string;
        const time = filters.time as string;
        

        if (!week_day || !subject || !time) {
            return response.status(400).json({
                error: 'Missing filters to search classes'
            })
        }

        const timeInMinutes = ConvertHourToMinutes(time);

        const classes = await Db('classes')
            .whereExists(function() {
                this.select('class_schedule.*')
                .from('class_schedule')
                .whereRaw('`class_schedule`.`class_id` = `classes`.`id`')
                .whereRaw('`class_schedule`.`week_day` = ??', [Number(week_day)])
                .whereRaw('`class_schedule`.`from` <= ??', [timeInMinutes])
                .whereRaw('`class_schedule`.`to` > ??', [timeInMinutes])
            })
            .where('classes.subject', '=', subject)
            .join('users', 'classes.user_id', '=', 'users.id')
            .select(['classes.*', 'users.*']);


        response.json(classes);
    }
}