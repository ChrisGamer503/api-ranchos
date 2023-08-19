import z from "zod"
import {prisma} from "../db/prisma.js"
import  Jwt  from "jsonwebtoken"



const crearUsuario = async (req, res) => {

    const usuarioEsquema = z.object({
        nombre: z.string().nonempty(),
        apellido: z.string().nonempty(),
        password: z.string().nonempty(),
        email: z.string().nonempty().email(),
    })

    //obtener
    const datos = req.body
    
    try {
    //Validar
    usuarioEsquema.parse(datos)
    //const [usuario] = await prisma.$queryRaw`SELECT * from usuario WHERE email = ${data.email}`
    const validacionUsuario = await prisma.usuario.findFirst({where: {email: datos.email}})

    if (validacionUsuario) {
        return res.status(404).send("El usuario ya existe")
    }

    //Insertar
    const usuarioCreado = await prisma.usuario.create({ data: datos })
    return res.status(201).json(usuarioCreado)    
    } catch (error) {
        console.log(error)
        return res.status(400).send("ERROR")
    }

}


const iniciarSesion = async (req, res) => {

    const usuarioEsquema = z.object({
        email: z.string().nonempty().email(),
        password: z.string().nonempty()
    })

    //obtener
    const datos = req.body

    try {
        //Validar
        usuarioEsquema.parse(datos)

        const validacionUsuario = await prisma.usuario.findFirst({where: {email: datos.email}})

        if (!validacionUsuario) {
            return res.status(404).send("El usuario no existe")
        }

        if (validacionUsuario.password !== datos.password) {
            return res.status(400).send("La contraseña es incorrecta")
        }

        //Inicio de sesion valido
        
        const payload = { id: validacionUsuario.id }
        const token = Jwt.sign(payload, process.env.SECRETA)
        
        return res.status(200).json({token})

    } catch (error) {
        console.log(error)
        return res.status(400).send("ERROR")
    }

}

const perfil = async(req,res)=>{
    return res.status(200).json(req.usuario);
}

export {
    crearUsuario,
    iniciarSesion,
    perfil
}
