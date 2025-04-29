INSERT INTO empleados (nombre, apellido, cedula, fecha_nacimiento, fecha_contratacion, direccion, email, telefono, rol_id, cargo, departamento_id, sueldo, estado, area, descripcion_empleado) VALUES
('Carlos', 'Mendoza', 12345678, '1985-03-15', '2018-06-10', 'Av. Principal 123', 'carlos.mendoza@hospital.com', '04121234567', NULL, 'Técnico de Mantenimiento', NULL, 2500, 'Activo', 'Mantenimiento', 'Especialista en equipos médicos y sistemas eléctricos'),
('María', 'González', 23456789, '1990-07-22', '2020-02-15', 'Calle 5 #10-20', 'maria.gonzalez@hospital.com', '04241234568', NULL, 'Supervisor de Mantenimiento', NULL, 3200, 'Activo', 'Mantenimiento', 'Supervisa todo el personal de mantenimiento y coordina reparaciones'),
('Luis', 'Pérez', 34567890, '1988-11-30', '2019-05-20', 'Urbanización Las Flores', 'luis.perez@hospital.com', '04161234569', NULL, 'Técnico HVAC', NULL, 2300, 'Activo', 'Mantenimiento', 'Especialista en sistemas de climatización y ventilación'),
('Ana', 'Rodríguez', 45678901, '1992-04-18', '2021-08-12', 'Sector El Paraíso', 'ana.rodriguez@hospital.com', '04261234570', NULL, 'Enfermera Jefe', NULL, 2800, 'Activo', 'Hospitalización', 'Supervisa el área de hospitalización y enfermería'),
('José', 'Martínez', 56789012, '1983-09-05', '2017-03-08', 'Residencias Altamira', 'jose.martinez@hospital.com', '04141234571', NULL, 'Electricista Hospitalario', NULL, 2600, 'Activo', 'Mantenimiento', 'Especialista en sistemas eléctricos hospitalarios'),
('Laura', 'Hernández', 67890123, '1991-12-14', '2020-11-03', 'Av. Bolívar 456', 'laura.hernandez@hospital.com', '04231234572', NULL, 'Técnico de Equipos Médicos', NULL, 2700, 'Activo', 'Mantenimiento', 'Mantenimiento preventivo y correctivo de equipos médicos'),
('Pedro', 'García', 78901234, '1987-06-25', '2019-09-17', 'Calle 8 #15-30', 'pedro.garcia@hospital.com', '04151234573', NULL, 'Médico General', NULL, 3500, 'Activo', 'Consultas', 'Atención primaria a pacientes'),
('Sofía', 'López', 89012345, '1993-02-28', '2022-01-10', 'Urbanización Los Pinos', 'sofia.lopez@hospital.com', '04271234574', NULL, 'Técnico de Plomería', NULL, 2200, 'Activo', 'Mantenimiento', 'Especialista en sistemas hidráulicos y sanitarios'),
('Juan', 'Díaz', 90123456, '1980-08-12', '2016-07-22', 'Sector La Floresta', 'juan.diaz@hospital.com', '04131234575', NULL, 'Jefe de Mantenimiento', NULL, 3800, 'Activo', 'Mantenimiento', 'Responsable de todo el departamento de mantenimiento'),
('Marta', 'Suárez', 01234567, '1986-05-09', '2018-04-05', 'Av. Libertador 789', 'marta.suarez@hospital.com', '04281234576', NULL, 'Laboratorista', NULL, 2900, 'Activo', 'Laboratorio', 'Toma y análisis de muestras médicas');

INSERT INTO modelos_equipos (Modelo, Nombre, Descripcion, Codigo, Marca, Unidades) VALUES
('MX-5000', 'Resonador Magnético', 'Equipo de resonancia magnética de 1.5 Tesla para diagnóstico por imágenes', 'RMN-MX5000', 'Siemens Healthineers', 2),
('Vent-Aire 3000', 'Ventilador Mecánico', 'Ventilador de última generación para cuidados intensivos', 'VENT-A3000', 'Philips Medical', 8),
('Tomoscan Elite', 'Tomógrafo Computarizado', 'Tomógrafo multicorte de 64 canales', 'TCT-64ELITE', 'GE Healthcare', 1),
('SteriMax 250', 'Autoclave', 'Autoclave clase B para esterilización de instrumental', 'STERI-B250', 'Tuttnauer', 4),
('Monitron V8', 'Monitor de Signos Vitales', 'Monitor multiparamétrico con 8 funciones de medición', 'MON-V8', 'Mindray', 12),
('CardioPlus 2000', 'Electrocardiógrafo', 'Electrocardiógrafo digital de 12 derivaciones', 'ECG-CP2000', 'Schiller', 5),
('DefibPro X', 'Desfibrilador', 'Desfibrilador manual con monitor integrado', 'DEF-XPRO', 'ZOLL Medical', 7),
('InfuSmart 500', 'Bomba de Infusión', 'Bomba de infusión de alta precisión para terapia intravenosa', 'INFU-SM500', 'Baxter', 15),
('UltraScan Pro', 'Ecógrafo', 'Equipo de ultrasonido diagnóstico con Doppler color', 'US-PRO', 'Samsung Medison', 3),
('SpinLab 9000', 'Centrífuga', 'Centrífuga de alta velocidad para laboratorio clínico', 'CENT-SL9000', 'Eppendorf', 6);

INSERT INTO equipos (Fecha_Instalacion, Estado, Frecuencia_mantenimiento, Numero_de_serie, Id_Modelo, Id_Ubicacion) VALUES
('2022-01-15', 'Operativo', 'Mensual', 'RMN-2022-001', 5, 1),
('2021-11-20', 'Operativo', 'Trimestral', 'VENT-2021-045', 2, 1),
('2023-03-10', 'En Mantenimiento', 'Semestral', 'TOMOG-2023-012', 7, 1),
('2020-09-05', 'Operativo', 'Anual', 'AUTOCL-2020-078', 3, 1),
('2022-06-18', 'Operativo', 'Bimestral', 'MONITOR-2022-156', 1, 1),
('2021-04-22', 'Inactivo', 'N/A', 'ECG-2021-033', 4, 1),
('2023-01-30', 'Operativo', 'Mensual', 'DESFIB-2023-005', 6, 1),
('2020-12-12', 'Operativo', 'Trimestral', 'BOMBA-2020-112', 8, 1),
('2022-08-25', 'En Reparación', 'Semestral', 'ULTRAS-2022-024', 9, 1),
('2021-07-14', 'Operativo', 'Anual', 'CENTRIF-2021-067', 10, 1);

INSERT INTO repuestos (Nombre, Descripcion, Numero_de_Pieza, Unidades, Unidades_Minimas, Unidades_Maximas, Id_Ubicacion) VALUES
('Filtro HEPA', 'Filtro de alta eficiencia para equipos de ventilación', 'FLT-HEPA-001', 15, 5, 20, 1),
('Sensor de Presión', 'Sensor para monitores de signos vitales', 'SNS-PRES-202', 8, 3, 15, 1),
('Batería para Desfibrilador', 'Batería recargable para desfibriladores ZOLL', 'BAT-DEF-XPRO', 6, 2, 10, 1),
('Válvula de Seguridad', 'Válvula para autoclaves clase B', 'VLV-STE-250', 10, 4, 12, 1),
('Cable ECG', 'Cable de 12 derivaciones para electrocardiógrafos', 'CBL-ECG-12', 20, 10, 30, 1),
('Rodamiento Centrífuga', 'Rodamiento para centrífugas de laboratorio', 'RDC-SL9000', 4, 2, 6, 1),
('Pantalla Táctil', 'Pantalla de reemplazo para monitores Mindray', 'PNT-MON-V8', 3, 1, 5, 1),
('Junta de Esterilización', 'Junta de goma para autoclaves', 'JNT-STE-B250', 12, 6, 18, 1),
('Fuente de Alimentación', 'Fuente para equipos de ultrasonido', 'FNT-US-PRO', 5, 2, 8, 1),
('Tubo de Rayos X', 'Tubo de repuesto para equipos de radiografía', 'TUB-RX-5000', 2, 1, 3, 1);