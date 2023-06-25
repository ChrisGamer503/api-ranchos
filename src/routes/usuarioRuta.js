import { Router } from "express";
import { crearUsuario, iniciarSesion } from "../controllers/usuarioControlador.js";
import { verificarMiddleware } from "../middleware/autentificacionUsuario.js";


const router = Router()

router.post("/register", crearUsuario)
router.post("/login", iniciarSesion)

function prueba(req, res) {
    console.log("Si funca")
    res.send("Si funciono perrooo")
}

router.get("/prueba/:id",verificarMiddleware, prueba)

export default router