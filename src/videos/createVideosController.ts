import { Request, Response } from 'express'
import { Resolutions, db } from '../db/db'
import { OutputVideoType } from '../input-output-types/output-video-type'
import { RequestWithBody } from './requestTypes'
import { CreateVideoModel } from '../models/CreateVideoModel'
import { OutputErrorsType } from '../input-output-types/output-errors-type'
import { InputVideoType } from '../input-output-types/input-video-type'
import { VideoDBType } from '../db/video-db-type'
import { currentDateISOString, nextDayDateISOString } from '../helper/createDate'

//контроллер для эндпоинта:



const inputValidation = (video: InputVideoType) => {
    const errors: OutputErrorsType = {
        errorsMessages: []
    }
    if (!video.title || video.title.length > 40 || typeof video.title !== "string" || !video.title.trim()) {
        errors.errorsMessages.push(
            {
                message: "Error!! Invalid title",
                field: 'title'
            }
        )
    }
    if (!video.author || video.author.length > 20 || typeof video.author !== "string" || !video.author.trim()) {
        errors.errorsMessages.push(
            {
                message: 'Error!! Invalid author',
                field: 'author'
            }
        )
    }
    if (video.availableResolutions && (!Array.isArray(video.availableResolutions)
        || video.availableResolutions.find(p => !Resolutions[p]))
        //|| video.availableResolutions.find(p => Resolutions.indexOf(p) === -1))

    ) {
        errors.errorsMessages.push({
            message: 'Error!!',
            field: 'availableResolution'
        })
    }
    return errors
}


export const createVideosController = (req: RequestWithBody<CreateVideoModel>,
    res: Response<OutputVideoType | OutputErrorsType>) => {

    const errors = inputValidation(req.body)
    if (errors.errorsMessages.length) {
        res
            .status(400)
            .json(errors)
        return
    }
    let inputData = { ...req.body }
    if (inputData['availableResolutions'] === undefined) {
        inputData.availableResolutions = null
    }
    const newVideo: VideoDBType = {
        id: Date.now() * 10000 + Math.random() * 1000,
        ...inputData,
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: currentDateISOString(),
        publicationDate: nextDayDateISOString(),
    }
    db.videos = [...db.videos, newVideo]

    res
        .status(201)
        .json(newVideo)
}
