import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const proyectos = await prisma.proyecto.findMany({
      orderBy: {
        fechaInicio: 'desc',
      },
    });
    return NextResponse.json(proyectos);
  } catch (error) {
    console.error('Error al obtener proyectos:', error);
    return NextResponse.json(
      { error: 'Error al obtener proyectos' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const proyecto = await prisma.proyecto.create({
      data: {
        nombre: body.nombre,
        descripcion: body.descripcion || null,
        estado: body.estado,
        fechaInicio: new Date(body.fechaInicio),
        fechaFin: body.fechaFin ? new Date(body.fechaFin) : null,
      },
    });
    return NextResponse.json(proyecto);
  } catch (error) {
    console.error('Error al crear proyecto:', error);
    return NextResponse.json(
      { error: 'Error al crear proyecto' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    
    const proyecto = await prisma.proyecto.update({
      where: { id },
      data: {
        ...data,
        fechaInicio: new Date(data.fechaInicio),
        fechaFin: data.fechaFin ? new Date(data.fechaFin) : null,
      },
    });
    return NextResponse.json(proyecto);
  } catch (error) {
    console.error('Error al actualizar proyecto:', error);
    return NextResponse.json(
      { error: 'Error al actualizar proyecto' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID de proyecto no proporcionado' },
        { status: 400 }
      );
    }

    await prisma.proyecto.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar proyecto:', error);
    return NextResponse.json(
      { error: 'Error al eliminar proyecto' },
      { status: 500 }
    );
  }
} 