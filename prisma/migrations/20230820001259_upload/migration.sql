-- CreateTable
CREATE TABLE "rancho" (
    "id" SERIAL NOT NULL,
    "id_usuario_propietario" INTEGER NOT NULL,
    "nombre_rancho" VARCHAR(50) NOT NULL,
    "descripcion" VARCHAR(255) NOT NULL,
    "direccion" VARCHAR(255) NOT NULL,
    "precio_por_noche" DOUBLE PRECISION NOT NULL,
    "cantidad_huesped" INTEGER NOT NULL,
    "verificado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "rancho_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reserva" (
    "id" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_rancho" INTEGER NOT NULL,
    "fecha_inicio" TIMESTAMP(3) NOT NULL,
    "fecha_fin" TIMESTAMP(3) NOT NULL,
    "precio_total" DOUBLE PRECISION NOT NULL,
    "cantidad_huesped" INTEGER NOT NULL,

    CONSTRAINT "reserva_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "rol" TEXT NOT NULL DEFAULT 'usuario',

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "fk_rancho_usuario_propietario" ON "rancho"("id_usuario_propietario");

-- CreateIndex
CREATE INDEX "fk_reserva_rancho" ON "reserva"("id_rancho");

-- CreateIndex
CREATE INDEX "fk_reserva_usuario" ON "reserva"("id_usuario");

-- AddForeignKey
ALTER TABLE "rancho" ADD CONSTRAINT "rancho_id_usuario_propietario_fkey" FOREIGN KEY ("id_usuario_propietario") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reserva" ADD CONSTRAINT "reserva_id_rancho_fkey" FOREIGN KEY ("id_rancho") REFERENCES "rancho"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reserva" ADD CONSTRAINT "reserva_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
