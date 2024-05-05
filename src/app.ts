import express from 'express'
import { SETTINGS } from './settings'
import { videosRouter } from './videos/videosRouter'
import { testingRouter } from './testing/testingRouter'
//import cors from 'cors'


export const app = express()
app.use(express.json()) // добавление ко всем реквестам body и query (превращает json в нормальный js-объект)
//app.use(cors())  //разрешается доступ вскм фронтам

app.get('/', (req, res) => {
    // эндпоинт, который будет показывать на верселе какая версия бэкэнда сейчас залита
    res.status(200).json({ version: '1.0' })
})
// app.get(SETTINGS.PATH.VIDEOS, getVideosController)
app.use(SETTINGS.PATH.VIDEOS, videosRouter)
app.use(SETTINGS.PATH.TESTING, testingRouter)