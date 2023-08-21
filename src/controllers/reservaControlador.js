import z, { date } from "zod"
import {prisma} from "../db/prisma.js"

//Crear
const crearReserva = async (req, res) => {
  const reservaEsquema = z.object({
    fecha_inicio: z.date().or(z.string()),
    fecha_fin: z.date().or(z.string()),
    cantidad_huesped: z.string().transform(Number),
  });

  // Obtener datos
  const datos = req.body;

  try {
    // Validar
    reservaEsquema.parse(datos);
    datos.id_usuario = req.usuario.id;
    datos.id_rancho = parseInt(req.params.id);
    datos.cantidad_huesped = parseInt(datos.cantidad_huesped);
    datos.fecha_inicio = new Date(datos.fecha_inicio);
    datos.fecha_fin = new Date(datos.fecha_fin);

    const diferenciaDias = await prisma.$queryRaw`
      SELECT EXTRACT(day FROM (${datos.fecha_fin} - ${datos.fecha_inicio})) as diferencia
    `;

    if (diferenciaDias[0].diferencia < 0) {
      return res.status(400).json({ message: "ERROR: FECHA INCORRECTA" });
    }

    const rancho = await prisma.rancho.findUnique({
      where: { id: datos.id_rancho },
    });

    if (!rancho) {
      return res.status(404).json({ message: "Rancho no encontrado" });
    }

    const precioTotal = diferenciaDias[0].diferencia * rancho.precio_por_noche;
    datos.precio_total = precioTotal;

    const validacionReserva = await prisma.$queryRaw`
      SELECT * FROM reserva
      WHERE 
        (${datos.fecha_inicio} BETWEEN fecha_inicio AND fecha_fin)
        OR (${datos.fecha_fin} BETWEEN fecha_inicio AND fecha_fin)
    `;

    if (validacionReserva.length > 0) {
      return res.status(400).json({ message: "ERROR: FECHA OCUPADA" });
    }

    // Insertar
    const reservaCreada = await prisma.reserva.create({ data: datos });
    return res.status(201).json(reservaCreada);
  } catch (error) {
    console.error(error);
    return res.status(400).send("ERROR");
  }
};

//Leer
const leerReservas = async (req, res) => {
  try {
    const reservaLeida = await prisma.reserva.findMany({where: {id_usuario: req.usuario.id}, include: {rancho: true}});
    return res.status(200).json(reservaLeida);
  } catch (error) {
    return res.status(400).json({ message: "ERROR" });
  }
};

//Leer individual
const individualReserva = async (req,res) =>{
    try {
        let {id} = req.params
        id = parseInt(id)
        const reservaIndividual = await prisma.reserva.findFirst({where: {id}})
        return res.status(200).json(reservaIndividual)

    } catch (error) {
        console.log(error)
        return res.status(400).json({message: "ERROR"})
    }
}

//Editar
const editarReserva = async (req, res) => {
  const reservaEsquema = z.object({
    fecha_inicio: z.date().or(z.string()),
    fecha_fin: z.date().or(z.string()),
    cantidad_huesped: z.string().transform(Number),
  });

  // Obtener datos
  const datos = req.body;

  try {
    // Validar
    reservaEsquema.parse(datos);
    datos.id_usuario = req.usuario.id;
    datos.id_rancho = parseInt(req.params.id);
    datos.cantidad_huesped = parseInt(datos.cantidad_huesped);
    datos.fecha_inicio = new Date(datos.fecha_inicio);
    datos.fecha_fin = new Date(datos.fecha_fin);

    let { id } = req.params;
    id = parseInt(id);

    // Calcular precio total
    const fechaInicio = datos.fecha_inicio.toISOString().split('T')[0];
    const fechaFin = datos.fecha_fin.toISOString().split('T')[0];
    const [precioTotal] = await prisma.$queryRaw`
      SELECT DATEDIFF(${fechaFin}, ${fechaInicio}) * precio_por_noche as precioFinal
      FROM rancho
      WHERE id = ${datos.id_rancho}
    `;
    datos.precio_total = precioTotal.precioFinal;

    // Verificar disponibilidad
    const [validacionReserva] = await prisma.$queryRaw`
      SELECT *
      FROM reserva
      WHERE
        (${datos.fecha_inicio} BETWEEN fecha_inicio AND fecha_fin OR
        ${datos.fecha_fin} BETWEEN fecha_inicio AND fecha_fin) AND
        id_rancho = ${datos.id_rancho}
    `;

    if (validacionReserva) {
      return res.status(400).json({ message: 'ERROR: FECHA OCUPADA' });
    }

    // Actualizar reserva
    const reservaCreada = await prisma.reserva.update({
      where: { id },
      data: datos,
    });

    return res.status(201).json(reservaCreada);
  } catch (error) {
    console.log(error);
    return res.status(400).send('ERROR');
  } finally {
    await prisma.$disconnect(); // Cierra la conexión de Prisma al finalizar
  }
};
//Eliminar
const eliminarReserva = async(req,res) => {
    try {
        let {id} = req.params
        id = parseInt(id)

        const reservaBorrada = await prisma.reserva.delete({where: {id}})
        return res.status(200).json(reservaBorrada)
    
        } catch (error) {
            return res.status(400).json({message: "ERROR"})    
        }
}

const verificarRancho = async (req, res) => {
  try {
    const id = parseInt(req.params.id); // Convierte a entero
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const rancho = await prisma.rancho.findUnique({ where: { id } });

    if (!rancho) {
      return res.status(404).json({ message: "Rancho no encontrado" });
    }

    await prisma.rancho.update({
      where: { id },
      data: { verificado: !rancho.verificado },
    });

    return res.status(200).json({ message: "Se cambió el estado de verificado." });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error interno del servidor");
  }
};
export {
    crearReserva,
    leerReservas,
    individualReserva,
    editarReserva,
    eliminarReserva,
    verificarRancho
}
