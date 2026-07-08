/*
  Warnings:

  - You are about to drop the column `cantidad` on the `ActividadProductiva` table. All the data in the column will be lost.
  - You are about to drop the column `id_predio` on the `ActividadProductiva` table. All the data in the column will be lost.
  - You are about to drop the column `subactividad` on the `ActividadProductiva` table. All the data in the column will be lost.
  - You are about to drop the column `tipo_actividad` on the `ActividadProductiva` table. All the data in the column will be lost.
  - You are about to drop the column `unidad_medida` on the `ActividadProductiva` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_fin` on the `Evento` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_inicio` on the `Evento` table. All the data in the column will be lost.
  - You are about to drop the column `nombre` on the `Evento` table. All the data in the column will be lost.
  - You are about to drop the column `tipo_evento` on the `Evento` table. All the data in the column will be lost.
  - The `estado` column on the `Evento` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `id_ddjj` on the `Observacion` table. All the data in the column will be lost.
  - You are about to drop the column `adrema` on the `Predio` table. All the data in the column will be lost.
  - You are about to drop the column `gps_poligono` on the `Predio` table. All the data in the column will be lost.
  - You are about to drop the column `id_ddjj` on the `Predio` table. All the data in the column will be lost.
  - You are about to drop the column `paraje` on the `Predio` table. All the data in the column will be lost.
  - You are about to drop the column `tipo_tenencia` on the `Predio` table. All the data in the column will be lost.
  - You are about to drop the column `rol` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the `DDJJ` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Productor` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `actividad` to the `ActividadProductiva` table without a default value. This is not possible if the table is not empty.
  - Added the required column `predioId` to the `ActividadProductiva` table without a default value. This is not possible if the table is not empty.
  - Added the required column `superficieHa` to the `ActividadProductiva` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo` to the `ActividadProductiva` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `Evento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `denominacion` to the `Evento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fechaInicio` to the `Evento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lugar` to the `Evento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo` to the `Evento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `declaracionJuradaId` to the `Observacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `codigoAdrema` to the `Predio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenencia` to the `Predio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Predio` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('PRODUCTOR', 'INSPECTOR', 'ADMINISTRADOR');

-- CreateEnum
CREATE TYPE "TipoPersona" AS ENUM ('FISICA', 'JURIDICA');

-- CreateEnum
CREATE TYPE "TipoDocumento" AS ENUM ('DNI', 'LC', 'LE', 'PASAPORTE', 'OTRO');

-- CreateEnum
CREATE TYPE "Sexo" AS ENUM ('M', 'F');

-- CreateEnum
CREATE TYPE "Provincia" AS ENUM ('BUENOS_AIRES', 'CATAMARCA', 'CHACO', 'CORDOBA', 'SANTA_FE', 'OTRO');

-- CreateEnum
CREATE TYPE "Tenencia" AS ENUM ('PROPIETARIO', 'SUCESION_INDIVISA', 'ARRENDATARIO', 'APARCERIA', 'CONTRATO_ACCIDENTAL', 'OCUPACION_CON_PERMISO', 'OCUPACION_DE_HECHO', 'OCUPACION_GRATUITA', 'OTROS');

-- CreateEnum
CREATE TYPE "ActividadEnum" AS ENUM ('AGRICULTURA', 'GANADERIA', 'FORESTAL', 'CULTIVOS_BAJO_COBERTURA', 'APICULTURA', 'OTROS');

-- CreateEnum
CREATE TYPE "ActividadTipo" AS ENUM ('AG', 'GA', 'BM', 'HO', 'MA', 'MF', 'MG', 'MH', 'OT');

-- CreateEnum
CREATE TYPE "EventoTipo" AS ENUM ('INUNDACION', 'SEQUIA', 'INCENDIO', 'GRANIZO', 'HELADA', 'VIENTO', 'EXCESO_HIDRICO', 'OTRO');

-- CreateEnum
CREATE TYPE "EventoEstado" AS ENUM ('BORRADOR', 'RELEVAMIENTO_ABIERTO', 'CERRADO');

-- CreateEnum
CREATE TYPE "DeclaracionEstado" AS ENUM ('BORRADOR', 'PRESENTADA');

-- DropForeignKey
ALTER TABLE "ActividadProductiva" DROP CONSTRAINT "ActividadProductiva_id_predio_fkey";

-- DropForeignKey
ALTER TABLE "DDJJ" DROP CONSTRAINT "DDJJ_id_evento_fkey";

-- DropForeignKey
ALTER TABLE "DDJJ" DROP CONSTRAINT "DDJJ_id_productor_fkey";

-- DropForeignKey
ALTER TABLE "Observacion" DROP CONSTRAINT "Observacion_id_ddjj_fkey";

-- DropForeignKey
ALTER TABLE "Predio" DROP CONSTRAINT "Predio_id_ddjj_fkey";

-- DropForeignKey
ALTER TABLE "Productor" DROP CONSTRAINT "Productor_id_usuario_fkey";

-- AlterTable
ALTER TABLE "ActividadProductiva" DROP COLUMN "cantidad",
DROP COLUMN "id_predio",
DROP COLUMN "subactividad",
DROP COLUMN "tipo_actividad",
DROP COLUMN "unidad_medida",
ADD COLUMN     "actividad" "ActividadEnum" NOT NULL,
ADD COLUMN     "gpsPoligono" JSONB,
ADD COLUMN     "predioId" TEXT NOT NULL,
ADD COLUMN     "superficieHa" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "tipo" "ActividadTipo" NOT NULL;

-- AlterTable
ALTER TABLE "Evento" DROP COLUMN "fecha_fin",
DROP COLUMN "fecha_inicio",
DROP COLUMN "nombre",
DROP COLUMN "tipo_evento",
ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "denominacion" TEXT NOT NULL,
ADD COLUMN     "fechaFin" TIMESTAMP(3),
ADD COLUMN     "fechaInicio" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "lugar" TEXT NOT NULL,
ADD COLUMN     "tipo" "EventoTipo" NOT NULL,
DROP COLUMN "estado",
ADD COLUMN     "estado" "EventoEstado" NOT NULL DEFAULT 'BORRADOR';

-- AlterTable
ALTER TABLE "Observacion" DROP COLUMN "id_ddjj",
ADD COLUMN     "declaracionJuradaId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Predio" DROP COLUMN "adrema",
DROP COLUMN "gps_poligono",
DROP COLUMN "id_ddjj",
DROP COLUMN "paraje",
DROP COLUMN "tipo_tenencia",
ADD COLUMN     "codigoAdrema" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "declaracionJuradaId" TEXT,
ADD COLUMN     "observaciones" TEXT,
ADD COLUMN     "productorProfileId" TEXT,
ADD COLUMN     "tenencia" "Tenencia" NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "municipio" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "rol",
ADD COLUMN     "profileCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "role" "RoleType" NOT NULL DEFAULT 'PRODUCTOR';

-- DropTable
DROP TABLE "DDJJ";

-- DropTable
DROP TABLE "Productor";

-- DropEnum
DROP TYPE "EstadoDDJJ";

-- DropEnum
DROP TYPE "EstadoEvento";

-- DropEnum
DROP TYPE "Rol";

-- DropEnum
DROP TYPE "TipoEvento";

-- CreateTable
CREATE TABLE "ProductorProfile" (
    "id" TEXT NOT NULL,
    "apellidoNombreORazonSocial" VARCHAR(60) NOT NULL,
    "tipoPersona" "TipoPersona" NOT NULL,
    "tipoDocumento" "TipoDocumento" NOT NULL,
    "numeroDocumento" VARCHAR(8) NOT NULL,
    "sexo" "Sexo",
    "cuitCuil" VARCHAR(11) NOT NULL,
    "pais" TEXT NOT NULL DEFAULT 'Argentina',
    "provincia" "Provincia" NOT NULL,
    "departamento" TEXT NOT NULL,
    "municipio" TEXT,
    "paraje" TEXT,
    "seccion" TEXT,
    "codigoPostal" TEXT,
    "barrio" TEXT,
    "calleRuta" TEXT,
    "numeroKm" TEXT,
    "sectorBloque" TEXT,
    "torrePiso" TEXT,
    "manzana" TEXT,
    "casa" TEXT,
    "telefono1" TEXT NOT NULL,
    "telefono2" TEXT,
    "telefono3" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ProductorProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeclaracionJurada" (
    "id" TEXT NOT NULL,
    "productorProfileId" TEXT NOT NULL,
    "eventoId" TEXT,
    "estado" "DeclaracionEstado" NOT NULL,
    "fechaPresentacion" TIMESTAMP(3),
    "observaciones" TEXT,

    CONSTRAINT "DeclaracionJurada_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeclaracionActividad" (
    "id" TEXT NOT NULL,
    "declaracionJuradaId" TEXT NOT NULL,
    "actividadProductivaId" TEXT NOT NULL,
    "superficieAfectadaHa" DECIMAL(65,30),
    "descripcionDano" TEXT NOT NULL,
    "porcentajeEstimado" INTEGER,

    CONSTRAINT "DeclaracionActividad_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductorProfile_cuitCuil_key" ON "ProductorProfile"("cuitCuil");

-- CreateIndex
CREATE UNIQUE INDEX "ProductorProfile_userId_key" ON "ProductorProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DeclaracionJurada_productorProfileId_eventoId_key" ON "DeclaracionJurada"("productorProfileId", "eventoId");

-- AddForeignKey
ALTER TABLE "ProductorProfile" ADD CONSTRAINT "ProductorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Predio" ADD CONSTRAINT "Predio_productorProfileId_fkey" FOREIGN KEY ("productorProfileId") REFERENCES "ProductorProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Predio" ADD CONSTRAINT "Predio_declaracionJuradaId_fkey" FOREIGN KEY ("declaracionJuradaId") REFERENCES "DeclaracionJurada"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActividadProductiva" ADD CONSTRAINT "ActividadProductiva_predioId_fkey" FOREIGN KEY ("predioId") REFERENCES "Predio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evento" ADD CONSTRAINT "Evento_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeclaracionJurada" ADD CONSTRAINT "DeclaracionJurada_productorProfileId_fkey" FOREIGN KEY ("productorProfileId") REFERENCES "ProductorProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeclaracionJurada" ADD CONSTRAINT "DeclaracionJurada_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Evento"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeclaracionActividad" ADD CONSTRAINT "DeclaracionActividad_declaracionJuradaId_fkey" FOREIGN KEY ("declaracionJuradaId") REFERENCES "DeclaracionJurada"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeclaracionActividad" ADD CONSTRAINT "DeclaracionActividad_actividadProductivaId_fkey" FOREIGN KEY ("actividadProductivaId") REFERENCES "ActividadProductiva"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Observacion" ADD CONSTRAINT "Observacion_declaracionJuradaId_fkey" FOREIGN KEY ("declaracionJuradaId") REFERENCES "DeclaracionJurada"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
