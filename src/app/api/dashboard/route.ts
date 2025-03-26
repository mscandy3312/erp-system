import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface ProyectoCount {
  nombre: string;
  _count: {
    tareas: number;
  };
}

interface EstadoTarea {
  estado: string;
  _count: {
    _all: number;
  };
}

export async function GET() {
  try {
    const [
      empleadosCount,
      proyectosActivos,
      tareasPendientes,
      activosCount,
      proyectos,
      estadosTareas,
    ] = await Promise.all([
      prisma.empleado.count(),
      prisma.proyecto.count({
        where: {
          estado: 'En progreso',
        },
      }),
      prisma.tarea.count({
        where: {
          estado: 'Pendiente',
        },
      }),
      prisma.activo.count(),
      prisma.proyecto.findMany({
        select: {
          nombre: true,
          _count: {
            select: {
              tareas: true,
            },
          },
        },
      }),
      prisma.tarea.groupBy({
        by: ['estado'],
        _count: {
          _all: true,
        },
      }),
    ]);

    const dashboardData = {
      empleadosCount,
      proyectosActivos,
      tareasPendientes,
      activosCount,
      proyectos: (proyectos as ProyectoCount[]).map((proyecto) => ({
        nombre: proyecto.nombre,
        tareas: proyecto._count.tareas,
      })),
      estadosTareas: (estadosTareas as EstadoTarea[]).map((estado) => ({
        estado: estado.estado,
        cantidad: estado._count._all,
      })),
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Error al obtener datos del dashboard:', error);
    return NextResponse.json(
      { error: 'Error al obtener datos del dashboard' },
      { status: 500 }
    );
  }
} 