-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('PRODUCTOR', 'INSPECTOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "EstadoUsuario" AS ENUM ('PENDIENTE', 'ACTIVO', 'INACTIVO');

-- CreateEnum
CREATE TYPE "TipoEvento" AS ENUM ('INUNDACION', 'INCENDIO', 'SEQUIA', 'OTRO');

-- CreateEnum
CREATE TYPE "EstadoEvento" AS ENUM ('ABIERTO', 'CERRADO', 'EN_PROCESO');

-- CreateEnum
CREATE TYPE "EstadoDDJJ" AS ENUM ('PENDIENTE', 'APROBADA', 'RECHAZADA');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "rol" "Rol" NOT NULL DEFAULT 'PRODUCTOR',
    "estado" "EstadoUsuario" NOT NULL DEFAULT 'PENDIENTE',
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Productor" (
    "id" TEXT NOT NULL,
    "cuit_cuil" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "domicilio" TEXT NOT NULL,
    "id_usuario" TEXT NOT NULL,

    CONSTRAINT "Productor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evento" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo_evento" "TipoEvento" NOT NULL,
    "fecha_inicio" TIMESTAMP(3) NOT NULL,
    "fecha_fin" TIMESTAMP(3),
    "estado" "EstadoEvento" NOT NULL,

    CONSTRAINT "Evento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DDJJ" (
    "id" TEXT NOT NULL,
    "id_evento" TEXT NOT NULL,
    "id_productor" TEXT NOT NULL,
    "fecha_presentacion" TIMESTAMP(3) NOT NULL,
    "estado" "EstadoDDJJ" NOT NULL,
    "observaciones" TEXT,

    CONSTRAINT "DDJJ_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Predio" (
    "id" TEXT NOT NULL,
    "id_ddjj" TEXT NOT NULL,
    "adrema" TEXT NOT NULL,
    "tipo_tenencia" TEXT NOT NULL,
    "departamento" TEXT NOT NULL,
    "municipio" TEXT NOT NULL,
    "paraje" TEXT NOT NULL,

    CONSTRAINT "Predio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActividadProductiva" (
    "id" TEXT NOT NULL,
    "id_predio" TEXT NOT NULL,
    "tipo_actividad" TEXT NOT NULL,
    "subactividad" TEXT NOT NULL,
    "cantidad" DOUBLE PRECISION NOT NULL,
    "unidad_medida" TEXT NOT NULL,

    CONSTRAINT "ActividadProductiva_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Observacion" (
    "id" TEXT NOT NULL,
    "id_ddjj" TEXT NOT NULL,
    "id_usuario" TEXT NOT NULL,
    "comentario" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Observacion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Productor_id_usuario_key" ON "Productor"("id_usuario");

-- AddForeignKey
ALTER TABLE "Productor" ADD CONSTRAINT "Productor_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DDJJ" ADD CONSTRAINT "DDJJ_id_evento_fkey" FOREIGN KEY ("id_evento") REFERENCES "Evento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DDJJ" ADD CONSTRAINT "DDJJ_id_productor_fkey" FOREIGN KEY ("id_productor") REFERENCES "Productor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Predio" ADD CONSTRAINT "Predio_id_ddjj_fkey" FOREIGN KEY ("id_ddjj") REFERENCES "DDJJ"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActividadProductiva" ADD CONSTRAINT "ActividadProductiva_id_predio_fkey" FOREIGN KEY ("id_predio") REFERENCES "Predio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Observacion" ADD CONSTRAINT "Observacion_id_ddjj_fkey" FOREIGN KEY ("id_ddjj") REFERENCES "DDJJ"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Observacion" ADD CONSTRAINT "Observacion_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
