-- Tabla de roles
CREATE TABLE roles (
    rol_id INT PRIMARY KEY,
    nombre VARCHAR(255),
    descripcion VARCHAR(255)
);

-- Tabla de departamentos
CREATE TABLE departamentos (
    departamento_id INT PRIMARY KEY,
    nombre VARCHAR(255),
    descripcion VARCHAR(255)
);

-- Tabla de empleados
CREATE TABLE empleados (
    empleado_id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255),
    apellido VARCHAR(255),
    cedula INT UNIQUE,
    fecha_nacimiento DATE,
    fecha_contratacion DATE,
    direccion VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    telefono VARCHAR(255) UNIQUE,
    rol_id INT,
    cargo VARCHAR(255),
    departamento_id INT,
    sueldo INT,
    FOREIGN KEY (rol_id) REFERENCES roles(rol_id),
    FOREIGN KEY (departamento_id) REFERENCES departamentos(departamento_id)
);

-- Tabla de usuarios
CREATE TABLE usuarios (
    usuario_id INT PRIMARY KEY,
    usuario VARCHAR(255),
    clave VARCHAR(255),
    empleado_id INT,
    FOREIGN KEY (empleado_id) REFERENCES empleados(empleado_id)
);

-- Tabla de nóminas
CREATE TABLE nominas (
    nomina_id INT PRIMARY KEY,
    salario_base DOUBLE,
    salario_neto DOUBLE,
    empleado_id INT,
    numero_cuenta VARCHAR(255) UNIQUE,
    FOREIGN KEY (empleado_id) REFERENCES empleados(empleado_id)
);

-- Tabla de horarios
CREATE TABLE horarios (
    horario_id INT PRIMARY KEY,
    turno VARCHAR(255),
    dia VARCHAR(255),
    empleado_id INT,
    FOREIGN KEY (empleado_id) REFERENCES empleados(empleado_id)
);

-- Tabla de modelos de equipos
CREATE TABLE modelos_equipos (
    modelo_id INT PRIMARY KEY,
    modelo VARCHAR(255),
    descripcion VARCHAR(255),
    marca VARCHAR(255),
    unidades INT
);

-- Tabla de ubicaciones en almacenes
CREATE TABLE almacenes_ubicaciones (
    almacenes_ubicaciones_id INT PRIMARY KEY,
    area VARCHAR(255),
    ubicacion VARCHAR(255)
);

-- Tabla de equipos
CREATE TABLE equipos (
    equipo_id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255),
    descripcion VARCHAR(255),
    fecha_instalacion DATE,
    estado VARCHAR(255),
    frecuencia_mantenimiento VARCHAR(255),
    modelo_id INT,
    ubicacion_id INT,
    FOREIGN KEY (modelo_id) REFERENCES modelos_equipos(modelo_id),
    FOREIGN KEY (ubicacion_id) REFERENCES almacenes_ubicaciones(almacenes_ubicaciones_id)
);

-- Tabla de repuestos
CREATE TABLE repuestos (
    repuesto_id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255),
    descripcion VARCHAR(255),
    codigo_repuesto INT,
    unidades INT,
    unidades_minimas INT,
    unidades_maximas INT,
    ubicacion_id INT,
    FOREIGN KEY (ubicacion_id) REFERENCES almacenes_ubicaciones(almacenes_ubicaciones_id)
);

-- Tabla de modelos de productos
CREATE TABLE modelo_productos (
    modelo_id INT PRIMARY KEY,
    nombre VARCHAR(255),
    descripcion VARCHAR(255),
    codigo_producto INT,
    tipo_producto VARCHAR(255),
    tipo_unidad VARCHAR(255),
    unidades DOUBLE,
    unidades_minimas DOUBLE,
    unidades_maximas DOUBLE
);

-- Tabla de productos
CREATE TABLE productos (
    producto_id INT PRIMARY KEY,
    modelo_id INT,
    fecha_vencimiento DATE,
    FOREIGN KEY (modelo_id) REFERENCES modelo_productos(modelo_id)
);

-- Tabla de instrumentos
CREATE TABLE instrumentos (
    instrumento_id INT PRIMARY KEY,
    nombre VARCHAR(255),
    descripcion VARCHAR(255),
    tipo_instrumento VARCHAR(255),
    unidades INT,
    unidades_minimas INT,
    unidades_maximas INT,
    codigo_instrumento INT
);

-- Tabla de ubicación de productos
CREATE TABLE productos_ubicacion (
    compuesto_id INT PRIMARY KEY,
    unidades DOUBLE,
    producto_id INT,
    almacen_id INT,
    FOREIGN KEY (producto_id) REFERENCES productos(producto_id),
    FOREIGN KEY (almacen_id) REFERENCES almacenes_ubicaciones(almacenes_ubicaciones_id)
);

-- Tabla de ubicación de instrumentos
CREATE TABLE instrumentos_ubicacion (
    compuesto_id INT PRIMARY KEY,
    unidades INT,
    instrumento_id INT,
    almacen_id INT,
    FOREIGN KEY (instrumento_id) REFERENCES instrumentos(instrumento_id),
    FOREIGN KEY (almacen_id) REFERENCES almacenes_ubicaciones(almacenes_ubicaciones_id)
);

CREATE TABLE mantenimiento_equipos (
    mantenimiento_id INT PRIMARY KEY AUTO_INCREMENT,
    tipomantenimiento VARCHAR(255),
    equipo_id INT,
    fecha_creacion DATETIME,
    descripcion VARCHAR(255),
    estado VARCHAR(255),
    campo VARCHAR(255),
    repuesto_id INT,
    FOREIGN KEY (equipo_id) REFERENCES equipos(equipo_id),
    FOREIGN KEY (repuesto_id) REFERENCES repuestos(repuesto_id)
);

CREATE TABLE ordenes_trabajo (
    orden_id INT PRIMARY KEY AUTO_INCREMENT,
    mantenimiento_id INT,
    empleado_id INT,
    fecha_ejecucion DATETIME,
    fecha_fin DATETIME,
    prioridad VARCHAR(255),
    FOREIGN KEY (empleado_id) REFERENCES empleados(empleado_id),
    FOREIGN KEY (mantenimiento_id) REFERENCES mantenimiento_equipos(mantenimiento_id)
);

CREATE TABLE reportes (
    reportes_id INT PRIMARY KEY AUTO_INCREMENT,
    mantenimiento_id INT,
    resultado VARCHAR(255),
    comentarios VARCHAR(255),
    FOREIGN KEY (mantenimiento_id) REFERENCES mantenimiento_equipos(mantenimiento_id)
);

-- Tabla de pacientes
CREATE TABLE pacientes (
    paciente_id INT PRIMARY KEY,
    nombre VARCHAR(255),
    apellido VARCHAR(255),
    genero VARCHAR(255),
    cedula INT UNIQUE,
    fecha_nacimiento DATE,
    direccion VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    telefono VARCHAR(255) UNIQUE
);

-- Tabla de historiales odontológicos
CREATE TABLE historiales_odontologicos (
    historial_id INT PRIMARY KEY,
    paciente_id INT,
    descripcion TEXT,
    fecha DATETIME,
    FOREIGN KEY (paciente_id) REFERENCES pacientes(paciente_id)
);

-- Tabla de odontodiagramas
CREATE TABLE odontodiagrama (
    odontodiagrama_id INT PRIMARY KEY,
    paciente_id INT,
    fecha_creacion DATE,
    historial_id INT,
    FOREIGN KEY (paciente_id) REFERENCES pacientes(paciente_id),
    FOREIGN KEY (historial_id) REFERENCES historiales_odontologicos(historial_id)
);

-- Tabla de consultas odontológicas
CREATE TABLE consultas_odontologicas (
    consulta_id INT PRIMARY KEY,
    paciente_id INT,
    odontologo_id INT,
    fecha_consulta DATETIME,
    historial_id INT,
    motivo VARCHAR(255),
    cita_id INT,
    FOREIGN KEY (paciente_id) REFERENCES pacientes(paciente_id),
    FOREIGN KEY (odontologo_id) REFERENCES empleados(empleado_id),
    FOREIGN KEY (historial_id) REFERENCES historiales_odontologicos(historial_id)
);

-- Tabla de sectores
CREATE TABLE sectores (
    sector_id INT PRIMARY KEY,
    odontodiagrama_id INT,
    nombre_sector VARCHAR(255),
    FOREIGN KEY (odontodiagrama_id) REFERENCES odontodiagrama(odontodiagrama_id)
);

-- Tabla de dientes
CREATE TABLE dientes (
    diente_id INT PRIMARY KEY,
    sector_id INT,
    numero_diente INT,
    FOREIGN KEY (sector_id) REFERENCES sectores(sector_id)
);

-- Tabla de segmentos
CREATE TABLE segmentos (
    segmento_id INT PRIMARY KEY,
    diente_id INT,
    numero_segmento INT,
    valor_afectacion INT,
    FOREIGN KEY (diente_id) REFERENCES dientes(diente_id)
);

-- Tabla de historiales médicos
CREATE TABLE historiales_medicos (
    historial_id INT PRIMARY KEY,
    paciente_id INT,
    fecha_registro DATETIME,
    diagnostico TEXT,
    tratamiento TEXT,
    observaciones TEXT,
    FOREIGN KEY (paciente_id) REFERENCES pacientes(paciente_id)
);

-- Tabla de consultas médicas
CREATE TABLE consultas_medicas (
    consulta_id INT PRIMARY KEY,
    paciente_id INT,
    medico_id INT,
    fecha_consulta DATETIME,
    historial_id INT,
    cita_id INT,
    FOREIGN KEY (paciente_id) REFERENCES pacientes(paciente_id),
    FOREIGN KEY (medico_id) REFERENCES empleados(empleado_id),
    FOREIGN KEY (historial_id) REFERENCES historiales_medicos(historial_id)
);

-- Tabla de habitaciones
CREATE TABLE habitaciones (
    habitacion_id INT PRIMARY KEY,
    ubicacion VARCHAR(255),
    estado VARCHAR(255)
);

-- Tabla de camas
CREATE TABLE camas (
    cama_id INT PRIMARY KEY,
    habitacion_id INT,
    estado BOOLEAN,
    FOREIGN KEY (habitacion_id) REFERENCES habitaciones(habitacion_id)
);

-- Tabla de hospitalizaciones
CREATE TABLE hospitalizaciones (
    hospitalizacion_id INT PRIMARY KEY,
    motivo VARCHAR(255),
    estado VARCHAR(255),
    fecha_ingreso DATETIME,
    fecha_egreso DATETIME,
    paciente_id INT,
    diagnostico TEXT,
    notas_medicas TEXT,
    medicamentos TEXT,
    dieta TEXT,
    habitacion_id INT,
    cama_id INT,
    FOREIGN KEY (paciente_id) REFERENCES pacientes(paciente_id),
    FOREIGN KEY (habitacion_id) REFERENCES habitaciones(habitacion_id),
    FOREIGN KEY (cama_id) REFERENCES camas(cama_id)
);

-- Tabla de signos vitales
CREATE TABLE signos_vitales (
    signos_vitales_id INT PRIMARY KEY,
    frecuencia_cardiaca VARCHAR(255),
    presion_arterial VARCHAR(255),
    frecuencia_respiratoria VARCHAR(255),
    temperatura_corporal VARCHAR(255),
    saturacion_oxigeno VARCHAR(255),
    balance_hidrico VARCHAR(255),
    fecha DATETIME,
    hospitalizacion_id INT,
    FOREIGN KEY (hospitalizacion_id) REFERENCES hospitalizaciones(hospitalizacion_id)
);

-- Tabla de tipos de citas
CREATE TABLE tipos_citas (
    tipo_cita_id INT PRIMARY KEY,
    nombre VARCHAR(255)
);

-- Tabla de citas
CREATE TABLE citas (
    cita_id INT PRIMARY KEY,
    paciente_id INT,
    fecha_cita DATETIME,
    turno VARCHAR(255),
    estado VARCHAR(255),
    tipo_cita_id INT,
    observaciones TEXT,
    FOREIGN KEY (paciente_id) REFERENCES pacientes(paciente_id),
    FOREIGN KEY (tipo_cita_id) REFERENCES tipos_citas(tipo_cita_id)
);

-- Tabla de recursos
CREATE TABLE recursos (
    recurso_id INT PRIMARY KEY,
    nombre VARCHAR(255),
    descripcion VARCHAR(255),
    codigo_recurso INT UNIQUE
);

-- Tabla de proveedores
CREATE TABLE proveedores (
    proveedor_id INT PRIMARY KEY,
    nombre VARCHAR(255),
    direccion VARCHAR(255),
    ref_direccion VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    telefono VARCHAR(255) UNIQUE,
    rif VARCHAR(255) UNIQUE
);

-- Tabla de requisitorias
CREATE TABLE requisitorias (
    requisitoria_id INT PRIMARY KEY,
    recurso_id INT,
    empleado_id INT,
    motivo VARCHAR(255),
    departamento VARCHAR(255),
    descripcion TEXT,
    fecha_emision DATETIME,
    fecha_cierre DATETIME,
    observaciones TEXT,
    estado VARCHAR(255),
    FOREIGN KEY (recurso_id) REFERENCES recursos(recurso_id),
    FOREIGN KEY (empleado_id) REFERENCES empleados(empleado_id)
);

-- Tabla de órdenes de compra
CREATE TABLE ordenes_compra (
    orden_compra_id INT PRIMARY KEY,
    tipo_orden VARCHAR(255),
    recurso_id INT,
    proveedor_id INT,
    fecha_orden DATETIME,
    fecha_esperada DATETIME,
    fecha_entrega DATETIME,
    estado VARCHAR(255),
    precio_unitario DOUBLE,
    cantidad DOUBLE,
    unidad_medida VARCHAR(255),
    monto_total DOUBLE,
    moneda VARCHAR(255),
    tipo_gasto VARCHAR(255),
    observaciones TEXT,
    FOREIGN KEY (recurso_id) REFERENCES recursos(recurso_id),
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(proveedor_id)
);

-- Tabla de tipos de pruebas
CREATE TABLE tipo_prueba (
    tipo_id INT PRIMARY KEY,
    nombre VARCHAR(255)
);

-- Tabla de solicitudes de laboratorio
CREATE TABLE solucitudes_laboratorio (
    solicitud_id INT PRIMARY KEY,
    paciente_id INT,
    medico_id INT,
    motivo VARCHAR(255),
    estado VARCHAR(255),
    fecha DATE,
    observacion VARCHAR(255),
    FOREIGN KEY (paciente_id) REFERENCES pacientes(paciente_id),
    FOREIGN KEY (medico_id) REFERENCES empleados(empleado_id)
);

-- Tabla de exámenes
CREATE TABLE examenes (
    examen_id INT PRIMARY KEY,
    fecha DATE,
    solicitud_id INT,
    tipo_prueba_id INT,
    path_resultados VARCHAR(255),
    FOREIGN KEY (solicitud_id) REFERENCES solucitudes_laboratorio(solicitud_id),
    FOREIGN KEY (tipo_prueba_id) REFERENCES tipo_prueba(tipo_id)
);

-- Tabla de ingresos
CREATE TABLE ingresos (
    ingresos_id INT PRIMARY KEY,
    referencia VARCHAR(255),
    cantidad INT
);

-- Tabla de pagos a empleados
CREATE TABLE pagos_empleados (
    pago_id INT PRIMARY KEY,
    fecha_pago DATE,
    empleado_id INT,
    FOREIGN KEY (empleado_id) REFERENCES empleados(empleado_id)
);

-- Relaciones adicionales para las citas
ALTER TABLE consultas_odontologicas ADD CONSTRAINT fk_consultas_odontologicas_citas FOREIGN KEY (cita_id) REFERENCES citas(cita_id);
ALTER TABLE consultas_medicas ADD CONSTRAINT fk_consultas_medicas_citas FOREIGN KEY (cita_id) REFERENCES citas(cita_id);