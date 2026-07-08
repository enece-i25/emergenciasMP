-- DropForeignKey
ALTER TABLE "DDJJ" DROP CONSTRAINT "DDJJ_id_evento_fkey";

-- AlterTable
ALTER TABLE "ActividadProductiva" ADD COLUMN     "renspa" TEXT;

-- AlterTable
ALTER TABLE "DDJJ" ALTER COLUMN "id_evento" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Predio" ADD COLUMN     "gps_poligono" TEXT;

-- AddForeignKey
ALTER TABLE "DDJJ" ADD CONSTRAINT "DDJJ_id_evento_fkey" FOREIGN KEY ("id_evento") REFERENCES "Evento"("id") ON DELETE SET NULL ON UPDATE CASCADE;
