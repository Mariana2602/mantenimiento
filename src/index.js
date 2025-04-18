import express from 'express'
import morgan from 'morgan'
import {join, dirname} from 'path'
import { fileURLToPath } from 'url'
import { listarMantenimientos, obtenerEquiposRepuestos, registrarMantenimiento, eliminarMantenimiento, obtenerMantenimientoEdicion, actualizarMantenimientoController } from './controllers/ordenMantenimientoController.js'
import { listarEquipos } from './controllers/equipoMantenimientoController.js'

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

app.set('port', process.env.PORT || 3000);

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

app.use('/mantenimiento', listarMantenimientos);
app.use('/datos-formulario', obtenerEquiposRepuestos);
app.use('/registro', registrarMantenimiento);
app.use('/eliminar/:id', eliminarMantenimiento);
app.use('/actualizar/:id', obtenerMantenimientoEdicion);
app.use('/enviar/:id', actualizarMantenimientoController);

app.use('/equipos', listarEquipos);

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'public', 'index.html'));
});

app.use(express.static(join(__dirname, 'public')));

app.listen(app.get('port'), ()=>
    console.log('Server listening on port', app.get('port'))
);