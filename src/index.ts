import express, { Express } from 'express';
import dotenv from 'dotenv';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import i18n from './helper/i18n';
dotenv.config();
const env = process.env.NODE_ENV || 'development';
let config = require('./config/config.json')[env];
global.config = config;
import { Request, Response } from 'express';
import { db } from './models/index';
import { privateRoutes, publicRoutes } from './routes/index';
import HandleErrorMessage from './middleware/validatorMessage';
import userAuth from './middleware/Auth';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './docs/swagger.json';

db.sequelize
  .sync({ alter: true })
  .then(() => {
    console.log('re-sync db.');
  })
  .catch((error: any) => {
    console.log('DB Error', error);
    throw new Error(error);
  });

const app: Express = express();
//app.use('/src/uploads', express.static(__dirname + '/uploads')); define Upload folder route here

/* Swagger */
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(
    '/api-docs',
    swaggerUi.serve, 
    swaggerUi.setup(swaggerDocument)
  );


app.use(cors());
app.use(bodyParser.json());
app.use(i18n.init);

/** Use routers */
app.all('/v1/private/*', userAuth);
app.use('/v1/private', privateRoutes);
app.use('/v1/public', publicRoutes);

//** Handle error message */
app.use(HandleErrorMessage);


const server: any = http.createServer(app);

server.listen(global.config.PORT, () => {
  console.log(`Server is started on`, global.config.PORT);
});
