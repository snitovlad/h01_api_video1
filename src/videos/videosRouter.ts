
import { Router } from 'express'
import { getVideosController } from './getVideosController'
import { createVideosController } from './createVideosController'
import { findVideoController } from './findVideoController'
import { deleteVideoController } from './deleteVideoController'
import { updateVideoController } from './updateVideoController'

export const videosRouter = Router()

videosRouter.get('/', getVideosController)
videosRouter.post('/', createVideosController)
videosRouter.get('/:id', findVideoController)
videosRouter.delete('/:id', deleteVideoController)
videosRouter.put('/:id', updateVideoController)

// ...