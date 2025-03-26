-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 26-03-2025 a las 05:04:14
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `erp_system`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `activo`
--

CREATE TABLE `activo` (
  `id` int(11) NOT NULL,
  `descripcion` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `estado` varchar(191) NOT NULL,
  `fechaAdquisicion` datetime(3) NOT NULL,
  `nombre` varchar(191) NOT NULL,
  `tipo` varchar(191) NOT NULL,
  `updatedAt` datetime(3) NOT NULL,
  `valor` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `activo`
--

INSERT INTO `activo` (`id`, `descripcion`, `createdAt`, `estado`, `fechaAdquisicion`, `nombre`, `tipo`, `updatedAt`, `valor`) VALUES
(1, 'Laptop HP ProBook', '2025-03-24 02:43:13.940', 'En uso', '2025-03-24 02:43:13.938', 'Laptop HP', 'Equipo', '2025-03-24 02:43:13.940', 1200),
(2, 'Monitor Dell 24\"', '2025-03-24 02:43:13.940', 'Disponible', '2025-03-24 02:43:13.939', 'Monitor Dell', 'Equipo', '2025-03-24 02:43:13.940', 300);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asistencia`
--

CREATE TABLE `asistencia` (
  `id` int(11) NOT NULL,
  `empleadoId` int(11) NOT NULL,
  `fecha` datetime(3) NOT NULL,
  `tipo` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `asistencia`
--

INSERT INTO `asistencia` (`id`, `empleadoId`, `fecha`, `tipo`, `createdAt`, `updatedAt`) VALUES
(1, 1, '2025-03-24 02:43:13.962', 'Entrada', '2025-03-24 02:43:13.963', '2025-03-24 02:43:13.963'),
(2, 2, '2025-03-24 02:43:13.962', 'Entrada', '2025-03-24 02:43:13.963', '2025-03-24 02:43:13.963');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empleado`
--

CREATE TABLE `empleado` (
  `id` int(11) NOT NULL,
  `nombre` varchar(191) NOT NULL,
  `apellido` varchar(191) NOT NULL,
  `cargo` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `email` varchar(191) NOT NULL,
  `telefono` varchar(191) DEFAULT NULL,
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `empleado`
--

INSERT INTO `empleado` (`id`, `nombre`, `apellido`, `cargo`, `createdAt`, `email`, `telefono`, `updatedAt`) VALUES
(1, 'María', 'García', 'Diseñadora', '2025-03-24 02:43:13.904', 'maria.garcia@empresa.com', '987654321', '2025-03-24 02:43:13.904'),
(2, 'Juan', 'Pérez', 'Desarrollador', '2025-03-24 02:43:13.904', 'juan.perez@empresa.com', '123456789', '2025-03-24 02:43:13.904'),
(3, 'FEDGEfdgaefdg', 'afegaefgaegfr', 'AFDGADFGAFEDG', '2025-03-25 00:45:16.796', 'afdgadfgEGFR@GMAIL', NULL, '2025-03-25 00:45:16.796'),
(4, 'terhgaergaerg', 'aergaergERGT', 'dwfQEFEWF', '2025-03-25 01:17:27.528', 'SADFGADFGAFRG@GMAIL', NULL, '2025-03-25 01:17:27.528');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mantenimiento`
--

CREATE TABLE `mantenimiento` (
  `id` int(11) NOT NULL,
  `activoId` int(11) NOT NULL,
  `tipo` varchar(191) NOT NULL,
  `descripcion` varchar(191) DEFAULT NULL,
  `fecha` datetime(3) NOT NULL,
  `costo` double NOT NULL,
  `estado` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `mantenimiento`
--

INSERT INTO `mantenimiento` (`id`, `activoId`, `tipo`, `descripcion`, `fecha`, `costo`, `estado`, `createdAt`, `updatedAt`) VALUES
(1, 1, 'Preventivo', 'Limpieza y actualización de software', '2025-03-24 02:43:13.949', 50, 'Completado', '2025-03-24 02:43:13.951', '2025-03-24 02:43:13.951');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proyecto`
--

CREATE TABLE `proyecto` (
  `id` int(11) NOT NULL,
  `nombre` varchar(191) NOT NULL,
  `descripcion` varchar(191) DEFAULT NULL,
  `estado` varchar(191) NOT NULL,
  `fechaInicio` datetime(3) NOT NULL,
  `fechaFin` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `proyecto`
--

INSERT INTO `proyecto` (`id`, `nombre`, `descripcion`, `estado`, `fechaInicio`, `fechaFin`, `createdAt`, `updatedAt`) VALUES
(1, 'Portal Web', 'Desarrollo del portal web corporativo', 'Pendiente', '2025-03-24 02:43:13.915', '2025-05-23 02:43:13.915', '2025-03-24 02:43:13.918', '2025-03-24 02:43:13.918'),
(2, 'Sistema ERP', 'Desarrollo del sistema ERP', 'En progreso', '2025-03-24 02:43:13.915', '2025-04-23 02:43:13.915', '2025-03-24 02:43:13.918', '2025-03-24 02:43:13.918'),
(3, 'erp', 'desarrollada por el fer', 'PENDIENTE', '2025-03-24 00:00:00.000', '2025-08-05 00:00:00.000', '2025-03-25 00:40:27.044', '2025-03-25 00:40:27.044');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `servicio`
--

CREATE TABLE `servicio` (
  `id` int(11) NOT NULL,
  `nombre` varchar(191) NOT NULL,
  `descripcion` varchar(191) DEFAULT NULL,
  `precio` double NOT NULL,
  `estado` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `servicio`
--

INSERT INTO `servicio` (`id`, `nombre`, `descripcion`, `precio`, `estado`, `createdAt`, `updatedAt`) VALUES
(1, 'Desarrollo Web', 'Servicio de desarrollo de aplicaciones web', 100, 'Activo', '2025-03-24 02:43:13.955', '2025-03-24 02:43:13.955'),
(2, 'Consultoría IT', 'Servicio de consultoría en tecnologías de información', 150, 'Activo', '2025-03-24 02:43:13.955', '2025-03-24 02:43:13.955');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tarea`
--

CREATE TABLE `tarea` (
  `id` int(11) NOT NULL,
  `estado` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `descripcion` varchar(191) DEFAULT NULL,
  `fechaFin` datetime(3) DEFAULT NULL,
  `fechaInicio` datetime(3) NOT NULL,
  `prioridad` varchar(191) NOT NULL,
  `proyectoId` int(11) DEFAULT NULL,
  `titulo` varchar(191) NOT NULL,
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tarea`
--

INSERT INTO `tarea` (`id`, `estado`, `createdAt`, `descripcion`, `fechaFin`, `fechaInicio`, `prioridad`, `proyectoId`, `titulo`, `updatedAt`) VALUES
(1, 'En progreso', '2025-03-24 02:43:13.930', 'Implementar la interfaz de usuario', NULL, '2025-03-24 02:43:13.928', 'Media', 2, 'Desarrollo de frontend', '2025-03-24 02:43:13.930'),
(2, 'Completada', '2025-03-24 02:43:13.930', 'Crear el esquema de la base de datos', '2025-03-24 02:43:13.928', '2025-03-24 02:43:13.928', 'Alta', 2, 'Diseño de base de datos', '2025-03-24 02:43:13.930');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id` int(11) NOT NULL,
  `nombre` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `rol` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id`, `nombre`, `email`, `password`, `rol`, `createdAt`, `updatedAt`) VALUES
(1, 'Juan Carlos', 'jcarlos61200@gmail.com', '$2b$10$UxHao6VGsfrBeGZwWHFAb.cWCxeEt7VvEdX2uEfDYlwboTqix8s9K', 'admin', '2025-03-24 02:43:13.879', '2025-03-24 02:43:13.879'),
(2, 'Fernando ', 'andy12044@hotmail.com', '$2a$10$LZxHudxi//9uOvw6bRNCueCVsTbjePJNttS3LMIH2oljrid3AtPXO', 'usuario', '2025-03-24 06:11:24.793', '2025-03-24 06:11:24.793');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('2dcad379-cb9c-4550-b25e-fc3943b83cad', '827761bc5fb1474a32700b9f7983e1bd5afa81970d1b95bcad374be4c99e18e8', '2025-03-24 01:05:34.849', '20250321033501_erpnextjs', NULL, NULL, '2025-03-24 01:05:34.602', 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `activo`
--
ALTER TABLE `activo`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `asistencia`
--
ALTER TABLE `asistencia`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `empleado`
--
ALTER TABLE `empleado`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Empleado_email_key` (`email`);

--
-- Indices de la tabla `mantenimiento`
--
ALTER TABLE `mantenimiento`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `proyecto`
--
ALTER TABLE `proyecto`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `servicio`
--
ALTER TABLE `servicio`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `tarea`
--
ALTER TABLE `tarea`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Tarea_proyectoId_fkey` (`proyectoId`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Usuario_email_key` (`email`);

--
-- Indices de la tabla `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `activo`
--
ALTER TABLE `activo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `asistencia`
--
ALTER TABLE `asistencia`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `empleado`
--
ALTER TABLE `empleado`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `mantenimiento`
--
ALTER TABLE `mantenimiento`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `proyecto`
--
ALTER TABLE `proyecto`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `servicio`
--
ALTER TABLE `servicio`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `tarea`
--
ALTER TABLE `tarea`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `tarea`
--
ALTER TABLE `tarea`
  ADD CONSTRAINT `Tarea_proyectoId_fkey` FOREIGN KEY (`proyectoId`) REFERENCES `proyecto` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
