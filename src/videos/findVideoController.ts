import { Request, Response } from 'express'
import { db } from '../db/db'
import { OutputVideoType } from '../input-output-types/output-video-type'
import { RequestWithParams } from './requestTypes'
import { URIParamsVideoIdModel } from '../models/URIParamsVideoIdModel'

//контроллер для эндпоинта:

export const findVideoController = (req: RequestWithParams<URIParamsVideoIdModel>,
    res: Response<OutputVideoType>) => {

    const foundVideo = db.videos.find(v => v.id === +req.params.id)
    if (!foundVideo) {
        res.sendStatus(404)
        return
    }
    res.json(foundVideo)
}
