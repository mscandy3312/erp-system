import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nombre, email, password } = body;

    // Verificar si el usuario ya existe
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email },
    });

    if (usuarioExistente) {
      return NextResponse.json(
        { error: 'El email ya está registrado' },
        { status: 400 }
      );
    }

    // Encriptar contraseña
    const hashedPassword = await hash(password, 10);

    // Crear usuario
    const usuario = await prisma.usuario.create({
      data: {
        nombre,
        email,
        password: hashedPassword,
        rol: 'usuario', // Por defecto, todos los usuarios nuevos tendrán rol 'usuario'
      },
    });

    // Eliminar la contraseña del objeto de respuesta
    const { password: _, ...usuarioSinPassword } = usuario;

    return NextResponse.json(usuarioSinPassword);
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    return NextResponse.json(
      { error: 'Error al registrar usuario' },
      { status: 500 }
    );
  }
} 