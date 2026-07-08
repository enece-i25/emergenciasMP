import express, { Request, Response } from 'express';
import prisma from './prisma.js';
import { authMiddleware, requireProfileComplete } from './auth.js';

export async function createDdjjHandler(req: Request, res: Response) {
  try {
    const productorIdentifier = req.body?.productorId || req.body?.id_productor || req.body?.productor_id;
    const eventoId = req.body?.eventoId || req.body?.id_evento || req.body?.evento_id;
    const fecha = req.body?.fecha || req.body?.fechaPresentacion || req.body?.fecha_presentacion;
    let estado = req.body?.estado;

    // normalize estado to enum values
    if (!estado) estado = 'BORRADOR';
    const estadoUpper = (estado as string).toUpperCase();
    if (estadoUpper.includes('PRES')) estado = 'PRESENTADA';
    else estado = 'BORRADOR';

    // resolve productorProfileId from either profile id or user id
    let productorProfileId: string | null = null;
    if (productorIdentifier) {
      const byId = await prisma.productorProfile.findUnique({ where: { id: productorIdentifier } });
      if (byId) productorProfileId = byId.id;
      else {
        const byUser = await prisma.productorProfile.findUnique({ where: { userId: productorIdentifier } });
        if (byUser) productorProfileId = byUser.id;
      }
    }

    if (!productorProfileId || !fecha) {
      return res.status(400).json({ error: 'Faltan campos requeridos: productorId y fecha.' });
    }

    const data: any = {
      productorProfileId,
      fechaPresentacion: new Date(fecha),
      estado,
    };
    if (eventoId) data.eventoId = eventoId;

    const ddjj = await prisma.declaracionJurada.create({
      data,
      include: { evento: true, productorProfile: true, predios: true },
    });

    return res.status(201).json(ddjj);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'No se pudo crear la DDJJ' });
  }
}

export function createApiRouter() {
  const router = express.Router();

  // Usuarios CRUD
  router.get('/usuarios', authMiddleware, async (req, res) => {
    const usuarios = await prisma.usuario.findMany({ include: { productorProfile: true } });
    res.json(usuarios);
  });

  router.get('/usuarios/:id', authMiddleware, async (req, res) => {
    const usuario = await prisma.usuario.findUnique({ where: { id: req.params.id }, include: { productorProfile: true } });
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuario);
  });

  router.put('/usuarios/:id', authMiddleware, async (req, res) => {
    const usuario = await prisma.usuario.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(usuario);
  });

  router.delete('/usuarios/:id', authMiddleware, async (req, res) => {
    await prisma.usuario.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  });

  // Productores CRUD (ProductorProfile)
  router.get('/productores', authMiddleware, async (req, res) => {
    const productores = await prisma.productorProfile.findMany();
    res.json(productores);
  });

  router.post('/productores', authMiddleware, async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'No autenticado' });

    const nombreValue = req.body.nombre || req.body.apellidoNombreORazonSocial || req.body.apellidoNombre;
    const cuitValue = req.body.cuit_cuil || req.body.cuitCuil;
    const telefonoValue = req.body.telefono1 || req.body.telefono || '0000000000';
    const numeroDocumentoValue = req.body.numeroDocumento || (cuitValue ? String(cuitValue).slice(0, 8) : undefined);

    const productor = await prisma.productorProfile.create({
      data: {
        userId,
        apellidoNombreORazonSocial: nombreValue || 'Sin nombre',
        cuitCuil: cuitValue || '00000000000',
        calleRuta: req.body.domicilio || req.body.calleRuta || 'No especificado',
        tipoPersona: req.body.tipoPersona || 'FISICA',
        tipoDocumento: req.body.tipoDocumento || 'DNI',
        numeroDocumento: numeroDocumentoValue || '00000000',
        provincia: req.body.provincia || 'BUENOS_AIRES',
        departamento: req.body.departamento || 'No especificado',
        telefono1: telefonoValue,
      },
    });
    await prisma.usuario.update({ where: { id: userId }, data: { estado: 'ACTIVO', profileCompleted: true } });
    res.status(201).json(productor);
  });

  router.get('/productores/:id', authMiddleware, async (req, res) => {
    const productor = await prisma.productorProfile.findUnique({ where: { id: req.params.id } });
    if (!productor) return res.status(404).json({ error: 'Productor no encontrado' });
    res.json(productor);
  });

  router.put('/productores/:id', authMiddleware, async (req, res) => {
    const productor = await prisma.productorProfile.update({ where: { id: req.params.id }, data: req.body });
    res.json(productor);
  });

  router.delete('/productores/:id', authMiddleware, async (req, res) => {
    await prisma.productorProfile.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  });

  // Eventos CRUD
  router.get('/eventos', authMiddleware, async (req, res) => {
    const eventos = await prisma.evento.findMany();
    res.json(eventos);
  });

  router.post('/eventos', authMiddleware, async (req, res) => {
    const evento = await prisma.evento.create({ data: req.body });
    res.status(201).json(evento);
  });

  router.get('/eventos/:id', authMiddleware, async (req, res) => {
    const evento = await prisma.evento.findUnique({ where: { id: req.params.id } });
    if (!evento) return res.status(404).json({ error: 'Evento no encontrado' });
    res.json(evento);
  });

  router.put('/eventos/:id', authMiddleware, async (req, res) => {
    const evento = await prisma.evento.update({ where: { id: req.params.id }, data: req.body });
    res.json(evento);
  });

  router.delete('/eventos/:id', authMiddleware, async (req, res) => {
    await prisma.evento.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  });

  // DDJJ CRUD
  router.get('/ddjjs', authMiddleware, requireProfileComplete, async (req, res) => {
    const ddjjs = await prisma.declaracionJurada.findMany({ include: { evento: true, productorProfile: true, predios: true, observacionesInspector: true } });
    res.json(ddjjs);
  });

  router.post('/ddjjs', authMiddleware, requireProfileComplete, async (req, res) => {
    const ddjj = await prisma.declaracionJurada.create({ data: req.body });
    res.status(201).json(ddjj);
  });

  router.post('/ddjj', authMiddleware, requireProfileComplete, createDdjjHandler);

  router.get('/ddjjs/:id', authMiddleware, requireProfileComplete, async (req, res) => {
    const ddjj = await prisma.declaracionJurada.findUnique({ where: { id: req.params.id }, include: { evento: true, productorProfile: true, predios: true, observacionesInspector: true } });
    if (!ddjj) return res.status(404).json({ error: 'DDJJ no encontrada' });
    res.json(ddjj);
  });

  router.put('/ddjjs/:id', authMiddleware, requireProfileComplete, async (req, res) => {
    const ddjj = await prisma.declaracionJurada.update({ where: { id: req.params.id }, data: req.body });
    res.json(ddjj);
  });

  router.delete('/ddjjs/:id', authMiddleware, requireProfileComplete, async (req, res) => {
    await prisma.declaracionJurada.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  });

  // Predios CRUD
  router.get('/predios', authMiddleware, requireProfileComplete, async (req, res) => {
    const predios = await prisma.predio.findMany();
    res.json(predios);
  });

  router.post('/predios', authMiddleware, requireProfileComplete, async (req, res) => {
    const predio = await prisma.predio.create({ data: req.body });
    res.status(201).json(predio);
  });

  router.get('/predios/:id', authMiddleware, requireProfileComplete, async (req, res) => {
    const predio = await prisma.predio.findUnique({ where: { id: req.params.id } });
    if (!predio) return res.status(404).json({ error: 'Predio no encontrado' });
    res.json(predio);
  });

  router.put('/predios/:id', authMiddleware, requireProfileComplete, async (req, res) => {
    const predio = await prisma.predio.update({ where: { id: req.params.id }, data: req.body });
    res.json(predio);
  });

  router.delete('/predios/:id', authMiddleware, requireProfileComplete, async (req, res) => {
    await prisma.predio.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  });

  // Actividad Productiva CRUD
  router.get('/actividades', authMiddleware, requireProfileComplete, async (req, res) => {
    const actividades = await prisma.actividadProductiva.findMany();
    res.json(actividades);
  });

  router.post('/actividades', authMiddleware, requireProfileComplete, async (req, res) => {
    const actividad = await prisma.actividadProductiva.create({ data: req.body });
    res.status(201).json(actividad);
  });

  router.get('/actividades/:id', authMiddleware, requireProfileComplete, async (req, res) => {
    const actividad = await prisma.actividadProductiva.findUnique({ where: { id: req.params.id } });
    if (!actividad) return res.status(404).json({ error: 'Actividad no encontrada' });
    res.json(actividad);
  });

  router.put('/actividades/:id', authMiddleware, requireProfileComplete, async (req, res) => {
    const actividad = await prisma.actividadProductiva.update({ where: { id: req.params.id }, data: req.body });
    res.json(actividad);
  });

  router.delete('/actividades/:id', authMiddleware, requireProfileComplete, async (req, res) => {
    await prisma.actividadProductiva.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  });

  // Observaciones CRUD
  router.get('/observaciones', authMiddleware, requireProfileComplete, async (req, res) => {
    const observaciones = await prisma.observacion.findMany({ include: { usuario: true, declaracionJurada: true } });
    res.json(observaciones);
  });

  router.post('/observaciones', authMiddleware, requireProfileComplete, async (req, res) => {
    const observacion = await prisma.observacion.create({ data: req.body });
    res.status(201).json(observacion);
  });

  router.get('/observaciones/:id', authMiddleware, requireProfileComplete, async (req, res) => {
    const observacion = await prisma.observacion.findUnique({ where: { id: req.params.id }, include: { usuario: true, declaracionJurada: true } });
    if (!observacion) return res.status(404).json({ error: 'Observación no encontrada' });
    res.json(observacion);
  });

  router.put('/observaciones/:id', authMiddleware, requireProfileComplete, async (req, res) => {
    const observacion = await prisma.observacion.update({ where: { id: req.params.id }, data: req.body });
    res.json(observacion);
  });

  router.delete('/observaciones/:id', authMiddleware, requireProfileComplete, async (req, res) => {
    await prisma.observacion.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  });

  // Perfil y reportes
  router.get('/me', authMiddleware, async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'No autenticado' });
    const usuario = await prisma.usuario.findUnique({ where: { id: userId }, include: { productorProfile: true } });
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuario);
  });

  router.post('/profile', authMiddleware, async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ error: 'No autenticado' });

      const existing = await prisma.productorProfile.findUnique({ where: { userId } });
      const nombreValue = req.body.nombre || req.body.apellidoNombreORazonSocial || req.body.apellidoNombre;
      const cuitValue = req.body.cuit_cuil || req.body.cuitCuil;
      const telefonoValue = req.body.telefono1 || req.body.telefono || '0000000000';
      const departamentoValue = req.body.departamento || 'No especificado';
      const provinciaValue = req.body.provincia || 'BUENOS_AIRES';
      const numeroDocumentoValue = req.body.numeroDocumento || (cuitValue ? String(cuitValue).slice(0, 8) : undefined);

      const createData: any = {
        userId,
        apellidoNombreORazonSocial: nombreValue || 'Sin nombre',
        cuitCuil: cuitValue || '00000000000',
        calleRuta: req.body.domicilio || req.body.calleRuta || 'No especificado',
        tipoPersona: req.body.tipoPersona || 'FISICA',
        tipoDocumento: req.body.tipoDocumento || 'DNI',
        numeroDocumento: numeroDocumentoValue || '00000000',
        provincia: provinciaValue,
        departamento: departamentoValue,
        telefono1: telefonoValue,
      };

      const updateData: any = {};
      if (nombreValue) updateData.apellidoNombreORazonSocial = nombreValue;
      if (cuitValue) updateData.cuitCuil = cuitValue;
      if (req.body.domicilio || req.body.calleRuta) updateData.calleRuta = req.body.domicilio || req.body.calleRuta;
      if (req.body.tipoPersona) updateData.tipoPersona = req.body.tipoPersona;
      if (req.body.tipoDocumento) updateData.tipoDocumento = req.body.tipoDocumento;
      if (req.body.numeroDocumento) updateData.numeroDocumento = req.body.numeroDocumento;
      if (req.body.provincia) updateData.provincia = req.body.provincia;
      if (req.body.departamento) updateData.departamento = req.body.departamento;
      if (telefonoValue) updateData.telefono1 = telefonoValue;

      let productor;
      if (existing) {
        productor = await prisma.productorProfile.update({ where: { id: existing.id }, data: updateData });
      } else {
        productor = await prisma.productorProfile.create({ data: createData });
        await prisma.usuario.update({ where: { id: userId }, data: { estado: 'ACTIVO', profileCompleted: true } });
      }
      res.json(productor);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'No se pudo guardar el perfil.' });
    }
  });

  router.get('/reportes/ddjj', authMiddleware, requireProfileComplete, async (req, res) => {
    const ddjjs = await prisma.declaracionJurada.findMany({ include: { evento: true, productorProfile: true, predios: true } });
    res.json(ddjjs);
  });

  router.get('/reportes/productores-afectados', authMiddleware, requireProfileComplete, async (req, res) => {
    const productores = await prisma.productorProfile.findMany({ include: { ddjjs: true } });
    res.json(productores);
  });

  router.get('/reportes/actividades', authMiddleware, requireProfileComplete, async (req, res) => {
    const actividades = await prisma.actividadProductiva.findMany({ include: { predio: { include: { declaracionJurada: true } } } });
    res.json(actividades);
  });

  return router;
}
