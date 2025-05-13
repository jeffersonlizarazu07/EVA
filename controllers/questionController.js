const Question = require('../models/question');

const questionController = {
    async questions(req, res) {
        try {
            const questions = await Question.getAll();
            if (!questions.length) {
                return res.status(204).json({ status: 204, message: 'No se encontraron preguntas' });
            }
            res.json({ status: 200, message: 'Preguntas obtenidas exitosamente', questions });
        } catch (error) {
            res.status(500).json({ status: 500, message: 'Error interno del servidor', error });
        }
    },

    async questionByID(req, res) {
        try {
            const question = await Question.getById(req.params.id);
            if (!question) {
                return res.status(404).json({ status: 404, message: 'La pregunta no fue encontrada' });
            }
            res.json({ status: 200, message: 'Pregunta obtenida exitosamente', question });
        } catch (error) {
            res.status(500).json({ status: 500, message: 'Error interno del servidor', error });
        }
    },

    async questionsxSurvey(req, res) {
        try {
            const questions = await Question.getBySurvey(req.params.id);
            if (!questions.length) {
                return res.status(204).json({ status: 204, message: 'No se encontraron preguntas para la encuesta' });
            }
            res.json({ status: 200, message: 'Preguntas obtenidas correctamente', data: questions });
        } catch (error) {
            res.status(500).json({ status: 500, message: 'Error interno del servidor', error });
        }
    },

    // Controlador postQuestion (backend)
async postQuestion(req, res) {
  //console.log('Datos recibidos en postQuestion:', req.body);

    try {
        const {
            conditional,
            conditional_answer,
            //frm_option,
            id_conditional,
            //percentage,
            question,
            //section,
            survey_id,
            type,
            select_option,
            selected_answer
          } = req.body;
          
          const newQuestion = await Question.create({
            conditional,
            conditional_answer,
            //frm_option,
            id_conditional,
            //percentage,
            question,
            //section,
            survey_id,
            type,
            select_option,
            selected_answer
          });
      res.status(201).json({
        status: 201,
        message: 'Pregunta creada exitosamente',
        data: newQuestion
      });
    } catch (error) {
      console.error('Error al crear la pregunta:', error);
      res.status(500).json({
        status: 500,
        message: 'Error al crear la pregunta',
        error: error.message
      });
    }
  },
  
    

  async putQuestion(req, res) {
    try {
      const { id } = req.params;
  
      // Solo los campos válidos de la tabla
      const {
        conditional,
        conditional_answer,
        //frm_option,
        id_conditional,
        //percentage,
        question,
        //section,
        survey_id,
        type
      } = req.body;
  
      const updatedQuestion = await Question.update(id, {
        conditional,
        conditional_answer,
        //frm_option,
        id_conditional,
        //percentage,
        question,
        //section,
        survey_id,
        type
      });
  
      if (!updatedQuestion || updatedQuestion.length === 0) {
        return res.status(404).json({ status: 404, message: 'La pregunta no existe' });
      }
  
      res.status(200).json({
        status: 200,
        message: 'Pregunta actualizada exitosamente',
        question: updatedQuestion
      });
    } catch (error) {
      console.error('Error al actualizar la pregunta:', error);
      res.status(500).json({
        status: 500,
        message: 'Error al actualizar la pregunta',
        error: error.message
      });
    }
  },

    async deleteQuestion(req, res) {
        try {
            const deleted = await Question.delete(req.params.id);
            if (!deleted) {
                return res.status(404).json({ status: 404, message: 'La pregunta no existe' });
            }
            res.json({ status: 200, message: 'Pregunta eliminada exitosamente' });
        } catch (error) {
            res.status(500).json({ status: 500, message: 'Error al eliminar la pregunta', error });
        }
    },

    async putConditionalQuestion(req, res) {  
      const { id } = req.params;
      const { id_conditional } = req.body;
      console.log('Id que llega----', id);
      console.log('Id conditional:----', id_conditional);

      try {
        const updated = await Question.updateConditionalId(id, id_conditional);

      if (updated === 0) {
        return res.status(404).json({ message: 'Pregunta no encontrada' });
      }
      res.status(200).json({ message: 'id_conditional actualizado correctamente' });
      } catch (error) {
        console.error('Error al actualizar la encuesta:', error);
        res.status(500).json({ message: 'Error al actualizar la encuesta', error: error.message });
      }
    }

};

module.exports = questionController;
