import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Buscar usuario
    const usuario = await prisma.usuario.findUnique({
      where: { email },
    });

    if (!usuario) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Verificar contraseña
    const passwordValido = await compare(password, usuario.password);

    if (!passwordValido) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Generar token
    const token = sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET || 'tu-secreto-seguro',
      { expiresIn: '1d' }
    );

    // Eliminar la contraseña del objeto de respuesta
    const { password: _, ...usuarioSinPassword } = usuario;

    return NextResponse.json({
      usuario: usuarioSinPassword,
      token,
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return NextResponse.json(
      { error: 'Error al iniciar sesión' },
      { status: 500 }
    );
  }
} 