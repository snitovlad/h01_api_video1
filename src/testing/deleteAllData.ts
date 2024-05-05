import { Request, Response } from 'express'
import { db } from '../db/db'




//контроллер для эндпоинта:

export const deleteAllData = (req: Request, res: Response) => {
    db.videos = [];
    res.sendStatus(204)
}

