# ERP System

Sistema de Gestión Empresarial desarrollado con Next.js y MySQL.

## Características

- Gestión de empleados
- Gestión de proyectos
- Gestión de tareas
- Gestión de activos
- Gestión de mantenimiento
- Gestión de servicios
- Control de asistencias
- Sistema de autenticación

## Requisitos

- Node.js 18 o superior
- MySQL 8 o superior
- npm o yarn

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/tu-usuario/erp-nextjs.git
cd erp-nextjs
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```
Editar el archivo `.env` con tus credenciales de base de datos y secretos.

4. Configurar la base de datos:
```bash
npx prisma db push
```

5. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

## Estructura del Proyecto

```
src/
├── app/                    # Rutas y páginas de la aplicación
├── components/            # Componentes reutilizables
├── lib/                   # Utilidades y configuraciones
└── prisma/               # Esquema y migraciones de la base de datos
```

## Tecnologías Utilizadas

- Next.js 14
- TypeScript
- Tailwind CSS
- Prisma ORM
- MySQL
- JWT para autenticación

## Contribuir

1. Fork el repositorio
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.
