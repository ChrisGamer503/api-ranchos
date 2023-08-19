import { Router } from "express";
import { crearUsuario, iniciarSesion, perfil } from "../controllers/usuarioControlador.js";
import { verificarMiddleware } from "../middleware/autentificacionUsuario.js";


const router = Router()

router.post("/register", crearUsuario)
router.post("/login", iniciarSesion)
router.get("/perfil", verificarMiddleware, perfil)

function prueba(req, res) {
    console.log("Si funca")
    res.send("Si funciono perrooo")
}

router.get("/prueba/:id",verificarMiddleware, prueba)

export default router
