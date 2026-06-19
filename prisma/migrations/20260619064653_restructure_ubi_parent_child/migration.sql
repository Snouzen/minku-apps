-- CreateEnum
CREATE TYPE "UbiStatus" AS ENUM ('INISIASI', 'SEDANG_BERLANGSUNG', 'SELESAI');

-- CreateEnum
CREATE TYPE "UbiDependency" AS ENUM ('MINKU', 'OPERASIONAL');

-- CreateTable
CREATE TABLE "ubi_administrasi" (
    "id" SERIAL NOT NULL,
    "status" "UbiStatus" NOT NULL DEFAULT 'INISIASI',
    "dependency" "UbiDependency",
    "vendorId" INTEGER,
    "nominalHasilEvaluasi" DOUBLE PRECISION,
    "nominalRealisasi" DOUBLE PRECISION,
    "ndIzinPrinsipGm" TEXT,
    "ndIzinPrinsipDirsar" TEXT,
    "ndIzinPenggunaanRka" TEXT,
    "ndBalasanDivisiUmum" TEXT,
    "sdiPemberitahuanRm" TEXT,
    "ndPermohonanPembayaran" TEXT,
    "batasPenerbitanKontrak" TIMESTAMP(3),
    "dokumentasiUrls" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ubi_administrasi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ubi_kegiatan" (
    "id" SERIAL NOT NULL,
    "administrasiId" INTEGER NOT NULL,
    "kegiatan" TEXT NOT NULL,
    "site" TEXT NOT NULL,
    "sdiPengajuanRm" TEXT,
    "nominalPengajuan" DOUBLE PRECISION,
    "progress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ubi_kegiatan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unit_produksi" (
    "idRegional" TEXT NOT NULL,
    "namaRegional" TEXT NOT NULL,
    "siteArea" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "alamat" TEXT DEFAULT '',
    "kodeRegional" TEXT,

    CONSTRAINT "unit_produksi_pkey" PRIMARY KEY ("idRegional")
);

-- CreateTable
CREATE TABLE "matrix_kegiatan" (
    "id" SERIAL NOT NULL,
    "namaKegiatan" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "matrix_kegiatan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matrix_tasks" (
    "id" SERIAL NOT NULL,
    "namaTask" TEXT NOT NULL,
    "kegiatanId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "matrix_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matrix_sub_tasks" (
    "id" SERIAL NOT NULL,
    "namaSubTask" TEXT NOT NULL,
    "goals" TEXT,
    "actionPlan" TEXT,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "sdiPengajuanRm" TEXT,
    "ndIzinPrinsipGm" TEXT,
    "ndIzinPrinsipDirsar" TEXT,
    "ndIzinPenggunaanRka" TEXT,
    "ndBalasanDivisiUmum" TEXT,
    "sdiPemberitahuanRm" TEXT,
    "ndPermohonanPembayaran" TEXT,
    "batasPenerbitanKontrak" TIMESTAMP(3),
    "taskId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "matrix_sub_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendors" (
    "id" SERIAL NOT NULL,
    "namaVendor" TEXT NOT NULL,
    "picVendor" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vendors_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ubi_administrasi" ADD CONSTRAINT "ubi_administrasi_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "vendors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ubi_kegiatan" ADD CONSTRAINT "ubi_kegiatan_administrasiId_fkey" FOREIGN KEY ("administrasiId") REFERENCES "ubi_administrasi"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matrix_tasks" ADD CONSTRAINT "matrix_tasks_kegiatanId_fkey" FOREIGN KEY ("kegiatanId") REFERENCES "matrix_kegiatan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matrix_sub_tasks" ADD CONSTRAINT "matrix_sub_tasks_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "matrix_tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
