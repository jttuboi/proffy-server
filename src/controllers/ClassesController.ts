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

    
}