import { VideoDBType } from './video-db-type'

export type DBType = { videos: VideoDBType[] }

export const db: DBType = {
    videos: [
        // {
        //     "id": 0,
        //     "title": "string",
        //     "author": "string",
        //     "canBeDownloaded": true,
        //     "minAgeRestriction": null,
        //     "createdAt": "2024-04-28T09:21:17.000Z",
        //     "publicationDate": "2024-04-28T09:21:17.000Z",
        //     "availableResolutions": [
        //         "P144"
        //     ]
        // }
    ]
}

//функция, которая будет менять базу данных - это такая оптимизация
export const setDB = (dataset?: Partial<DBType>) => {
    if (!dataset) {
        db.videos = []
        // db.some = []
        return
    }
    db.videos = dataset.videos || db.videos
    // db.some = dataset.some || db.some
}

//export const Resolutions = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160']

type ResolutionsType = {
    [key: string]: string;
}
export let Resolutions: ResolutionsType = {
    'P144': 'P144',
    'P240': 'P240',
    'P360': 'P360',
    'P480': 'P480',
    'P720': 'P720',
    'P1080': 'P1080',
    'P1440': 'P1440',
    'P2160': 'P2160'
}