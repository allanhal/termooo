const express = require('express');
const cookieParser = require('cookie-parser');
const gameRoutes = require('./routes/game');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const swaggerDocument = YAML.load(path.join(__dirname, './swagger.yaml'));
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cookieParser());
// cors
app.use(cors());

app.options('*', cors());

app.use('/game', gameRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = app;
