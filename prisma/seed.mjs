import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Crear usuario de prueba
  const hashedPassword = await bcrypt.hash('Iscandy3312', 10);
  const usuario = await prisma.usuario.upsert({
    where: { email: 'jcarlos61200@gmail.com' },
    update: {},
    create: {
      nombre: 'Juan Carlos',
      email: 'jcarlos61200@gmail.com',
      password: hashedPassword,
      rol: 'admin',
    },
  });

  // Crear empleados de prueba
  const empleados = await Promise.all([
    prisma.empleado.create({
      data: {
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan.perez@empresa.com',
        telefono: '123456789',
        cargo: 'Desarrollador',
      },
    }),
    prisma.empleado.create({
      data: {
        nombre: 'María',
        apellido: 'García',
        email: 'maria.garcia@empresa.com',
        telefono: '987654321',
        cargo: 'Diseñadora',
      },
    }),
  ]);

  // Crear proyectos de prueba
  const proyectos = await Promise.all([
    prisma.proyecto.create({
      data: {
        nombre: 'Sistema ERP',
        descripcion: 'Desarrollo del sistema ERP',
        estado: 'En progreso',
        fechaInicio: new Date(),
        fechaFin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días después
      },
    }),
    prisma.proyecto.create({
      data: {
        nombre: 'Portal Web',
        descripcion: 'Desarrollo del portal web corporativo',
        estado: 'Pendiente',
        fechaInicio: new Date(),
        fechaFin: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 días después
      },
    }),
  ]);

  // Crear tareas de prueba
  await Promise.all([
    prisma.tarea.create({
      data: {
        titulo: 'Diseño de base de datos',
        descripcion: 'Crear el esquema de la base de datos',
        estado: 'Completada',
        prioridad: 'Alta',
        fechaInicio: new Date(),
        fechaFin: new Date(),
        proyectoId: proyectos[0].id,
      },
    }),
    prisma.tarea.create({
      data: {
        titulo: 'Desarrollo de frontend',
        descripcion: 'Implementar la interfaz de usuario',
        estado: 'En progreso',
        prioridad: 'Media',
        fechaInicio: new Date(),
        proyectoId: proyectos[0].id,
      },
    }),
  ]);

  // Crear activos de prueba
  const activos = await Promise.all([
    prisma.activo.create({
      data: {
        nombre: 'Laptop HP',
        descripcion: 'Laptop HP ProBook',
        tipo: 'Equipo',
        estado: 'En uso',
        valor: 1200,
        fechaAdquisicion: new Date(),
      },
    }),
    prisma.activo.create({
      data: {
        nombre: 'Monitor Dell',
        descripcion: 'Monitor Dell 24"',
        tipo: 'Equipo',
        estado: 'Disponible',
        valor: 300,
        fechaAdquisicion: new Date(),
      },
    }),
  ]);

  // Crear mantenimientos de prueba
  await Promise.all([
    prisma.mantenimiento.create({
      data: {
        activoId: activos[0].id,
        tipo: 'Preventivo',
        descripcion: 'Limpieza y actualización de software',
        fecha: new Date(),
        costo: 50,
        estado: 'Completado',
      },
    }),
  ]);

  // Crear servicios de prueba
  await Promise.all([
    prisma.servicio.create({
      data: {
        nombre: 'Desarrollo Web',
        descripcion: 'Servicio de desarrollo de aplicaciones web',
        precio: 100,
        estado: 'Activo',
      },
    }),
    prisma.servicio.create({
      data: {
        nombre: 'Consultoría IT',
        descripcion: 'Servicio de consultoría en tecnologías de información',
        precio: 150,
        estado: 'Activo',
      },
    }),
  ]);

  // Crear asistencias de prueba
  await Promise.all([
    prisma.asistencia.create({
      data: {
        empleadoId: empleados[0].id,
        fecha: new Date(),
        tipo: 'Entrada',
      },
    }),
    prisma.asistencia.create({
      data: {
        empleadoId: empleados[1].id,
        fecha: new Date(),
        tipo: 'Entrada',
      },
    }),
  ]);

  console.log('Datos de prueba creados exitosamente');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 