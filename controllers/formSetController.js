const FormSet = require('../models/formSet');
const FormDTO = require('../dtos/formDTO');

const formSetController = {

    async forms(req, res) {
        try {
          // Utilizamos la función getAll para obtener los formularios con la información adicional
          const forms = await FormSet.getAll();
          
          if (forms.length === 0) {
            return res.status(200).json({ data: [] });;
          }
      
          // Ya no necesitamos mapear los formularios, ya que la consulta `getAll` devuelve la estructura correcta
          // Simplemente devolvemos la respuesta con los datos obtenidos directamente
          res.json({
            status: '200',
            message: 'Formularios obtenidos correctamente',
            data: forms, // Los datos ya están formateados correctamente
          });
          
        } catch (error) {
          res.status(500).json({ status: '500', message: 'Error interno del servidor', error });
        }
    },

    async formByID(req, res) {
        const idValidation = FormDTO.validarId(req.params.id);
        if (!idValidation.status) {
            return res.status(400).json(idValidation);
        }

        try {
            const id = req.params.id;
            const form = await FormSet.getById(id);
            if (!form) {
                return res.status(404).json({ status: '404', message: 'Formulario no encontrado' });
            }
            res.json({ status: '200', message: 'Formulario obtenido correctamente', data: form });
        } catch (error) {
            res.status(500).json({ status: '500', message: 'Error al obtener el formulario', error });
        }
    },

    async formsxClients(req, res) {
        try {
            const clientIds = req.query.clientIds ? req.query.clientIds.split(',').map(Number) : [];
            if (!clientIds.length) {
                return res.status(400).json({ status: '400', message: 'Parámetro clientIds es requerido.' });
            }
            const forms = await FormSet.getByClients(clientIds);
            if (forms.length === 0) {
                return res.status(404).json({ status: '404', message: 'No se encontraron formularios para los clientes proporcionados' });
            }
            res.json({ status: '200', message: 'Formularios obtenidos correctamente', data: forms });
        } catch (error) {
            res.status(500).json({ status: '500', message: 'Error interno del servidor', error });
        }
    },

    async postForm(req, res) {
        try {
            console.log('Datos recibidos en para crear formulario: --- ', req.body);
            const validarForm = await FormDTO.validateForm(req.body);        
            if(!validarForm.status){
                return res.status(400).json(validarForm);
            }

            // const data = req.body; 
            // await FormSet.create(data);
            
            const { title, description, state, idClient, creation_date, created_by } =req.body;
            
            await FormSet.create({title, description, state, idClient, creation_date, created_by});
          
            res.status(201).json({ status: '201', message: 'Formulario creado correctamente' });
        } catch (error) {
            res.status(500).json({ status: '500', message: 'Error al crear el formulario', error });
        }
    },

    async putForm(req, res) {
        try {
            console.log('Datos recibidos para actualizar formulario: --- ', req.body);
            const validarForm = await FormDTO.validateUpdate(req.body);
            if(!validarForm.status){
                return res.status(400).json(validarForm);
            }

            const idValidation = FormDTO.validarId(req.params.id);
            if (!idValidation.status) {
                return res.status(400).json(idValidation);
            }
           
            const updated = await FormSet.update(req.params.id, req.body);
            if (!updated) {
                return res.status(404).json({ status: '404', message: 'Formulario no encontrado' });
            }
            res.json({ status: '200', message: 'Formulario actualizado correctamente' });
        } catch (error) {
            console.log("Error", error)
            res.status(500).json({ status: '500', message: 'Error al actualizar el formulario', error });
        }
    },

    async patchForm(req, res) {
        const idValidation = FormDTO.validarId(req.params.id);
        if (!idValidation.status) {
            return res.status(400).json(idValidation);
        }

        try {
            const updated = await FormSet.toggleState(req.params.id);
            if (!updated) {
                return res.status(404).json({ status: '404', message: 'Formulario no encontrado' });
            }
            res.json({ status: '200', message: 'Estado del formulario actualizado correctamente' });
        } catch (error) {
            res.status(500).json({ status: '500', message: 'Error al cambiar el estado', error });
        }
    },

    async deleteForm(req, res) {
        const idValidation = FormDTO.validarId(req.params.id);
        if (!idValidation.status) {
            return res.status(400).json(idValidation);
        }
        try {
            const deleted = await FormSet.delete(req.params.id);
            if (!deleted) {
                return res.status(404).json({ status: '404', message: 'Formulario no encontrado' });
            }
            res.json({ status: '200', message: 'Formulario eliminado correctamente' });
        } catch (error) {
            res.status(500).json({ status: '500', message: 'Error al eliminar el formulario', error });
        }
    }
};

module.exports = formSetController;