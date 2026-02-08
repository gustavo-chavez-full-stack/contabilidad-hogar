# FinancePro - Sistema de Gestión Financiera Personal 🚀

FinancePro es una aplicación web de nivel profesional diseñada para el control total de las finanzas personales. Permite gestionar ingresos, gastos, ahorros recurrentes y realizar proyecciones financieras a largo plazo con una interfaz moderna, oscura y altamente interactiva.

---

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 19** + **Vite**: Interfaz de usuario rápida y moderna.
- **Lucide React**: Set de iconos consistentes y elegantes.
- **Recharts**: Visualización de datos mediante gráficos dinámicos (Pie, Bar, AreaCharts).
- **Framer Motion**: Animaciones fluidas para una experiencia premium.
- **CSS Variables**: Sistema de temas (Claro/Oscuro/Sistema) 100% personalizable.
- **Google OAuth**: Autenticación social integrada.

### Backend
- **NestJS**: Framework de Node.js progresivo para aplicaciones eficientes y escalables.
- **Prisma ORM**: Modelado de datos y gestión de base de datos PostgreSQL.
- **JWT**: Seguridad mediante JSON Web Tokens.
- **Google Auth Library**: Validación de identidades OAuth2.

### Infraestructura
- **Docker & Docker Compose**: Contenerización completa de la base de datos, backend y frontend.
- **PostgreSQL**: Base de datos relacional robusta.

---

## 🌟 Características Principales

1. **Dashboard Inteligente**: Resumen visual de tu balance, ingresos y gastos con reportes exportables a CSV.
2. **Gastos Fijos & Suscripciones**: Gestión de pagos recurrentes con un motor de optimización que detecta excesos de servicios de streaming y duplicidades.
3. **Planificación & Proyecciones**: Simulador de interés compuesto con escenarios "What-If" para modelar metas futuras (ej: compra de casa, aumentos salariales).
4. **Historial Detallado**: Registro completo de movimientos con filtros y capacidad de exportación.
5. **Configuración Regional**: Soporte nativo para **Pesos Chilenos (CLP)**, gestión de notificaciones y personalización de apariencia.
6. **Seguridad Avanzada**: Login tradicional y acceso mediante Google OAuth.

---

## 📂 Estructura del Proyecto

```text
contabilidad-hogar/
├── backend/          # NestJS API, Prisma Schema, Auth Logic
├── frontend/         # React SPA, Context Providers, Pages & Components
├── docker/           # Configuración de Docker Compose y Dockerfiles
└── README.md         # Esta guía
```

---

## 🚀 Cómo Levantar el Proyecto

La forma más sencilla y recomendada es utilizando **Docker**.

### 1. Requisitos Previos
- Tener instalado [Docker Desktop](https://www.docker.com/products/docker-desktop/).
- Tener instalado [Node.js](https://nodejs.org/) y [Yarn](https://yarnpkg.com/) (si deseas manipular el código localmente).

### 2. Configuración de Variables de Entorno
Crea un archivo `.env` en la carpeta `backend/` con los siguientes valores:
```env
DATABASE_URL="postgresql://user:password@db:5432/contabilidad_hogar?schema=public"
JWT_SECRET="tu_secreto_super_seguro"
```

### 3. Ejecución con Docker (Recomendado)
Desde la raíz del proyecto, navega a la carpeta docker y ejecuta:
```bash
cd docker
docker-compose up -d --build
```
Esto levantará:
- **Base de Datos**: PostgreSQL en el puerto `5432`.
- **Backend API**: Disponible en `http://localhost:3001`.
- **Frontend App**: Disponible en `http://localhost:3000`.

### 4. Acceso al Sistema
- Abre tu navegador en: **`http://localhost:3000`**.
- Puedes registrarte con un usuario nuevo o usar la opción de Google.

---

## 🔑 Configuración de Google OAuth

Para habilitar el inicio de sesión con Google:
1. Crea un proyecto en la [Google Cloud Console](https://console.cloud.google.com/).
2. Configura una "Pantalla de consentimiento OAuth".
3. Crea "Credenciales de ID de cliente de OAuth 2.0" (Tipo: Aplicación web).
4. Añade `http://localhost:3000` a los "Orígenes de JavaScript autorizados".
5. Copia tu **Client ID** y pégalo en el archivo:
   `frontend/src/main.tsx` -> variable `GOOGLE_CLIENT_ID`.

---

## 📝 Comandos Útiles

### Producción/Docker
- **Detener todo**: `docker-compose down`
- **Ver logs**: `docker-compose logs -f`

### Desarrollo Local (fuera de Docker)
- **Instalar dependencias**: `yarn install` (en frontend y backend).
- **Iniciar backend**: `yarn start:dev` (en /backend).
- **Iniciar frontend**: `yarn dev` (en /frontend).
- **Migrar base de datos**: `npx prisma migrate dev` (en /backend).

---

## 📄 Licencia
Este proyecto es de uso privado y educativo bajo licencia MIT.

Desarrollado con ❤️ para la gestión financiera inteligente.
