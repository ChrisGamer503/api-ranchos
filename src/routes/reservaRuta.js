import { Router } from "express";
import {  adminMiddleware, verificarMiddleware } from "../middleware/autentificacionUsuario.js";
import { crearReserva, editarReserva, eliminarReserva, individualReserva, leerReservas } from "../controllers/reservaControlador.js";

const router = Router()

//Crear
router.post("/:id",verificarMiddleware, crearReserva)

//Leer
router.get("/",verificarMiddleware, leerReservas)

//Leer individual
router.get("/:id", verificarMiddleware, individualReserva)

//Editar
router.patch("/:id", verificarMiddleware, adminMiddleware, editarReserva)

//Eliminar
router.delete("/:id", verificarMiddleware, eliminarReserva)

export default router
