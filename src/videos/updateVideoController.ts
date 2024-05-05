import { Request, Response } from 'express'
import { Resolutions, db } from '../db/db'
import { OutputVideoType } from '../input-output-types/output-video-type'
import { RequestWithParams, RequestWithParamsAndBody } from './requestTypes'
import { URIParamsVideoIdModel } from '../models/URIParamsVideoIdModel'
import { CreateVideoModel } from '../models/CreateVideoModel'
import { InputUpdateVideoType, InputVideoType } from '../input-output-types/input-video-type'
import { OutputErrorsType } from '../input-output-types/output-errors-type'
import { VideoDBType } from '../db/video-db-type'
import { currentDateISOString, dateTimeRegex, nextDayDateISOString } from '../helper/createDate'
import { UpdateVideoModel } from '../models/UpdateVideoModel'

//контроллер для эндпоинта:

const inputValidation = (video: InputUpdateVideoType) => {
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
            message: 'Error!! Invalid availableResolution',
            field: 'availableResolution'
        })
    }
    if (video.canBeDownloaded && typeof video.canBeDownloaded !== 'boolean') {
        errors.errorsMessages.push({
            message: 'Error!! Invalid canBeDownloaded (should be boolean)',
            field: 'canBeDownloaded'
        })
    }
    if (video.minAgeRestriction &&
        ((typeof video.minAgeRestriction !== 'number' && video.minAgeRestriction !== null)
            || video.minAgeRestriction < 1 || video.minAgeRestriction > 18)) {
        errors.errorsMessages.push({
            message: 'Error!! Invalid minAgeRestriction',
            field: 'minAgeRestriction'
        })
    }

    if (video.publicationDate && (typeof video.publicationDate !== 'string'
        || !dateTimeRegex.test(video.publicationDate))) {
        errors.errorsMessages.push({
            message: 'Error!! Invalid publicationDate',
            field: 'publicationDate'
        })
    }

    return errors
}

export const updateVideoController = (req: RequestWithParamsAndBody<URIParamsVideoIdModel, UpdateVideoModel>,
    res: Response) => {

    let foundVideo = db.videos.find(v => v.id === +req.params.id)

    if (!foundVideo) {
        res.sendStatus(404)
        return
    }

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
    if (inputData['canBeDownloaded'] === undefined) {
        inputData.canBeDownloaded = false
    }
    if (inputData['minAgeRestriction'] === undefined) {
        inputData.minAgeRestriction = null
    }
    if (inputData['publicationDate'] === undefined) {
        inputData.publicationDate = currentDateISOString()
    }

    foundVideo = { ...foundVideo, ...inputData }
    const index = db.videos.findIndex(obj => obj.id === foundVideo.id);
    db.videos[index] = { ...db.videos[index], ...foundVideo }

    res
        .sendStatus(204)
}
