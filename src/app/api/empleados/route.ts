import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const empleados = await prisma.empleado.findMany();
    return NextResponse.json(empleados);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener los empleados' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const empleado = await prisma.empleado.create({
      data: {
        nombre: body.nombre,
        apellido: body.apellido,
        email: body.email,
        cargo: body.cargo,
      },
    });
    return NextResponse.json(empleado);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al crear el empleado' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const empleado = await prisma.empleado.update({
      where: { id: body.id },
      data: {
        nombre: body.nombre,
        apellido: body.apellido,
        email: body.email,
        cargo: body.cargo,
      },
    });
    return NextResponse.json(empleado);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al actualizar el empleado' },
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
        { error: 'ID de empleado no proporcionado' },
        { status: 400 }
      );
    }
    
    await prisma.empleado.delete({
      where: { id: parseInt(id) },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al eliminar el empleado' },
      { status: 500 }
    );
  }
}
