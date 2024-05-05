import express from 'express';
import { deleteAllData } from './deleteAllData';

export const testingRouter = express.Router()

testingRouter.delete('/all-data', deleteAllData)
