import express from 'express';
import routes from './routes';

const app = express();
const port = 3000;

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// v1 api routes
app.use('/api/v1', routes);

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});

module.exports = app;
