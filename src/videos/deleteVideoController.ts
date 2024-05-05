import { Request, Response } from 'express'
import { db } from '../db/db'
import { RequestWithParams } from './requestTypes'
import { URIParamsVideoIdModel } from '../models/URIParamsVideoIdModel'

//контроллер для эндпоинта:

export const deleteVideoController = (req: RequestWithParams<URIParamsVideoIdModel>,
    res: Response) => {

    const foundVideo = db.videos.find(v => v.id === +req.params.id)
    if (!foundVideo) {
        res.sendStatus(404)
        return
    }
    db.videos = db.videos.filter(v => v.id !== +req.params.id)

    res.sendStatus(204)
}
