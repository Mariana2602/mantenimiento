import express from 'express'
import morgan from 'morgan'
import {join, dirname} from 'path'
import { fileURLToPath } from 'url'
import mantenimientoRoute from './routes/mantenimientoRoute.js';
import reporteRoute from './routes/reporteRoute.js'

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

app.set('port', process.env.PORT || 3004);

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

app.use('/mantenimiento', mantenimientoRoute);
app.use('/reporte', reporteRoute);

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'view', 'index.html'));
});

app.use(express.static(join(__dirname, 'view')));

app.listen(app.get('port'), ()=>
    console.log('Server listening on port', app.get('port'))
);
