import { timeStamp } from 'console';
import express from 'express';
import { Request, Response } from 'express';


const IndexrouterV1 = express.Router();

IndexrouterV1.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'hello World',
    status: 'ok',
    version: '1.0.0',
    docs: 'https://example.docs.codewithabhishe.com',
    timeStamp: new Date().toISOString(),
  });
});

export default IndexrouterV1;
