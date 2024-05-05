import { Request, Response } from 'express'
import { db } from '../db/db'
import { OutputVideoType } from '../input-output-types/output-video-type'

//контроллер для эндпоинта:

export const getVideosController = (req: Request, res: Response<OutputVideoType[]>) => {
    res
        .status(200)
        .json(db.videos)
}