import { req } from './test-helpers'
// import {setDB} from '../src/db/db'
// import {dataset1} from './datasets'
import { SETTINGS } from '../src/settings'
import { Resolutions, db, setDB } from '../src/db/db'
import { dataset1 } from './datasets'
import { InputUpdateVideoType, InputVideoType } from '../src/input-output-types/input-video-type'
import { currentDateISOString } from '../src/helper/createDate'

//простой тест:

describe('/videos', () => {
    beforeAll(async () => {
        // await req.delete('/testing/all-data')
    })

    it('should return 200 and empty array', async () => {
        setDB()
        const res = await req
            .get(SETTINGS.PATH.VIDEOS)
            .expect(200)
        //console.log(res.body)
        expect(res.body.length).toBe(0)
    })

    it('should get not empty array', async () => {
        setDB(dataset1)
        const res = await req
            .get(SETTINGS.PATH.VIDEOS)
            .expect(200)
        //console.log(res.body)
        expect(res.body.length).toBe(1)
        expect(res.body[0]).toEqual(dataset1.videos[0])
    })

    it('should return 404 for not exiting video', async () => {
        setDB(dataset1)

        const res = await req
            .get(SETTINGS.PATH.VIDEOS + '/-100') //нет такого id
            .expect(404) // проверка на ошибку
    })

    //создание нового видео
    it('should create video', async () => {
        setDB()
        const newVideo: InputVideoType = {
            title: 't1',
            author: 'a1',
            availableResolutions: [Resolutions.P1440]
        }
        const res = await req
            .post(SETTINGS.PATH.VIDEOS)
            .send(newVideo) // отправка данных
            .expect(201)

        expect(res.body.title).toBe(newVideo.title)
        expect(res.body.author).toBe(newVideo.author)
        expect(res.body.availableResolutions).toEqual(newVideo.availableResolutions)
    })

    it('shouldn\'t create video with incorrect input data', async () => {
        setDB()
        const newVideo: InputVideoType = {
            title: 't1',
            author: 'a1',
            availableResolutions: ["P8"] //incorrect input data
        }
        const res = await req
            .post(SETTINGS.PATH.VIDEOS)
            .send(newVideo) // отправка данных
            .expect(400)

        await req
            .get(SETTINGS.PATH.VIDEOS)
            .expect(200, [])
        expect(res.body.availableResolutions).toEqual(undefined)
    })

    it('shouldn\'t create video with incorrect input title', async () => {
        setDB()
        const newVideo: InputVideoType = {
            title: '   ', //incorrect input data
            author: 'a1',
            availableResolutions: [Resolutions.P1440]
        }
        const res = await req
            .post(SETTINGS.PATH.VIDEOS)
            .send(newVideo) // отправка данных
            .expect(400)

        await req
            .get(SETTINGS.PATH.VIDEOS)
            .expect(200, [])
        expect(res.body.availableResolutions).toEqual(undefined)
    })

    //не должен обновить с некорректными входными данными 
    it(`shouldn't update video with incorrect input data`, async () => {
        setDB(dataset1)
        const updateVideo: InputUpdateVideoType = {
            title: 't1',
            author: 'a1',
            availableResolutions: ["P8"], //incorrect input data
            canBeDownloaded: true,
            minAgeRestriction: null,
            publicationDate: currentDateISOString(),
        }

        await req
            .put(SETTINGS.PATH.VIDEOS + '/' + db.videos[0].id)
            .send(updateVideo)
            .expect(400)
        //проверим, что действительно не создался курс
        const res2 = await req
            .get(SETTINGS.PATH.VIDEOS + '/' + db.videos[0].id)
            .expect(200, db.videos[0])
        expect(res2.body).toEqual(db.videos[0])
    })

    //не должен обновить с некорректным входным author 
    it(`shouldn't update video with incorrect input data`, async () => {
        setDB(dataset1)
        const updateVideo: InputUpdateVideoType = {
            title: 't1',
            author: '    ', //incorrect input author
            availableResolutions: [Resolutions.P1440],
            canBeDownloaded: true,
            minAgeRestriction: null,
            publicationDate: currentDateISOString(),
        }

        await req
            .put(SETTINGS.PATH.VIDEOS + '/' + db.videos[0].id)
            .send(updateVideo)
            .expect(400)
        //проверим, что действительно не создался курс
        const res2 = await req
            .get(SETTINGS.PATH.VIDEOS + '/' + db.videos[0].id)
            .expect(200, db.videos[0])
        expect(res2.body).toEqual(db.videos[0])
    })

    //не должно обновиться видео, которого нет
    it(`shouldn't update video that not exist`, async () => {
        setDB(dataset1)
        const updateVideo: InputUpdateVideoType = {
            title: 't1',
            author: 'a1',
            availableResolutions: [Resolutions.P1440],
            canBeDownloaded: true,
            minAgeRestriction: null,
            publicationDate: currentDateISOString(),
        }

        await req
            .put(SETTINGS.PATH.VIDEOS + '/-100')
            .send(updateVideo)
            .expect(404)
    })

    //должно обновиться видео с корректными входными данными
    it(`should update video with correct input data`, async () => {
        setDB(dataset1)
        const updateVideo: InputUpdateVideoType = {
            title: 't1',
            author: 'a1',
            availableResolutions: [Resolutions.P1440],
            canBeDownloaded: true,
            minAgeRestriction: null,
            publicationDate: currentDateISOString(),
        }

        const res1 = await req
            .put(SETTINGS.PATH.VIDEOS + '/' + db.videos[0].id)
            .send(updateVideo)
            .expect(204)
        //проверим, что действительно обновился курс
        const res2 = await req
            .get(SETTINGS.PATH.VIDEOS + '/' + db.videos[0].id)
            .expect(200, {
                ...db.videos[0],
                title: updateVideo.title,
                author: updateVideo.author,
                availableResolutions: updateVideo.availableResolutions,
                canBeDownloaded: updateVideo.canBeDownloaded,
                minAgeRestriction: updateVideo.minAgeRestriction,
                publicationDate: updateVideo.publicationDate,
            })
    })

    //удаление видео и возвращение пустого массива
    it(`should delete video and return empty array`, async () => {
        setDB(dataset1)
        //проверили, что видео есть в базе данных
        await req
            .get(SETTINGS.PATH.VIDEOS)
            .expect(200, dataset1.videos)
        //удалим его
        await req
            .delete(SETTINGS.PATH.VIDEOS + '/' + db.videos[0].id)
            .expect(204)
        //проверим, что действительно удалился
        await req
            .get(SETTINGS.PATH.VIDEOS)
            .expect(200, [])
    })

    //не должен удалить несуществующее видео
    it(`shouldn't delete video that not exist`, async () => {
        setDB(dataset1)
        //проверили, что видео есть в базе данных
        await req
            .get(SETTINGS.PATH.VIDEOS)
            .expect(200, dataset1.videos)

        await req
            .delete(SETTINGS.PATH.VIDEOS + '/-100')
            .expect(404)
        //проверим, что ничего не удалилось
        await req
            .get(SETTINGS.PATH.VIDEOS + '/' + db.videos[0].id)
            .expect(200, db.videos[0])
    })
})

