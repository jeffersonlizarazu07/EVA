const { getDateTimeForSQL } = require("../helpers/dateHelper");

class AnswersFormModel {
  constructor() {
    this.knex = require('../config/db');
    this.table = 'answers_form';
    this.table_ = 'monitoring';
    this.table_users = 'users';
    this.table_questions_form ='questions_form';
    this.table_blocks = 'blocks';
    this.table_form_set= 'form_set';
    this.table_clients ='clients';

    this.idPrueba = 2;
    this.starDatePrueba = '2025-05-19';
    this.endDate = '2025-07-09'

  }

  // traer todas las respuestas del monitoreo
  async getMonitoring(){
    try{
      return await this.knex(this.table_).select('*');
    } catch (error) {
      console.error('Error al obtener el monitoreo:', error);
      throw new Error('No se pudo obtener el monitoreo debido a un error en el servidor.' + error.message);
    }
  }


  // ...

  // traer respuestas multiples 

  async getResponseMult(){
    try {
      return await this.knex(`${this.table} as af`)
      .select(
        'af.id',
        'af.answer',
        'af.question_id',
        'q.id', 
        'q.selected_answer', 
        'q.select_option'
      )
      .join(`${this.table_questions_form} as q`, 'af.question_id', 'q.id')
    } catch (error) {
       console.error('Error al obtener  respuestas multiples:', error);
      throw new Error('No se pudo obtener  respuestas multiples' + error.message);

    }
  }

  // ...

  // traer reporte filtrados 

  async getReportFilter(fromId, starDate, endDate){
    try {
      return await this.knex(`${this.table_} as m`)
        .select(
          this.knex.raw(`CONCAT(a.firstname, " ", a.lastname) as nombre_agente`),
          this.knex.raw(`CONCAT(mo.firstname, " ", mo.lastname) as nombre_monitor`),
          'f.title as nombre_form',
          'q.question_name',
          'af.answer',
          'm.date as fecha_monitoreo',
          'm.score',
          'm.feedback',
          'q.id'
        )
        .join(`${this.table_users} as a`, 'm.id_user_agent', 'a.id')
        .join(`${this.table_users} as mo`, 'm.id_user_monitor', 'mo.id')
        .join(`${this.table} as af`, 'm.id_user_agent', 'af.idUser')
        .join(`${this.table_questions_form} as q`, 'q.id', 'af.question_id')
        .join(`${this.table_blocks} as b`, 'b.id', 'q.block_id')
        .join(`${this.table_form_set} as f`, 'f.id', 'b.form_id')
        .where('a.type', 4)
        .andWhere('mo.type', 1)
        // 
        .andWhere('f.id', '=' , fromId)
        .andWhereRaw('m.date  = af.date')
        .andWhere(this.knex.raw('DATE(m.date) >=?' , [starDate] ))
        .andWhere(this.knex.raw('DATE(m.date) <=?' , [endDate] ));
        
        // ...
        
    } catch (error) {
      console.error('Error al obtener el reporte de monitoreos filtrados:', error);
      throw new Error('No se pudo obtener el reporte de monitoreos filtrados debido a un error en el servidor. ' + error.message);
    }
  }

  // obtener clientes y informacion de los forms_set
  async getClientsAndForms(){
    try {
      return await this.knex(`${this.table_form_set} as fr`)
        .select(
          `fr.id`,
          `title`,
          `creation_date`, 
          `updated_date`,  
          `idClient`, 
          'c.client'
        )
        .join(`${this.table_clients} as c`, 'fr.idClient', 'c.id')
    } catch (error) {
      console.error('Error al obtener clientes y formularios:', error);
      throw new Error('No se pudieron obtener los clientes y formularios debido a un error en el servidor.' + error.message);
    }
  }

  // traer reporte de los monitoreos 
 
  async getReportMonitoring() {
    try {
      return await this.knex(`${this.table_} as m`)
        .select(
          this.knex.raw(`CONCAT(a.firstname, " ", a.lastname) as nombre_agente`),
          this.knex.raw(`CONCAT(mo.firstname, " ", mo.lastname) as nombre_monitor`),
          'f.title as nombre_form',
          'q.question_name',
          'af.answer',
          'm.date as fecha_monitoreo',
          'm.score',
          'm.feedback',
          'q.id'
        )
        .join(`${this.table_users} as a`, 'm.id_user_agent', 'a.id')
        .join(`${this.table_users} as mo`, 'm.id_user_monitor', 'mo.id')
        .join(`${this.table} as af`, 'm.id_user_agent', 'af.idUser')
        .join(`${this.table_questions_form} as q`, 'q.id', 'af.question_id')
        .join(`${this.table_blocks} as b`, 'b.id', 'q.block_id')
        .join(`${this.table_form_set} as f`, 'f.id', 'b.form_id')
        .where('a.type', 4)
        .andWhere('mo.type', 1)
        .andWhereRaw('m.date  = af.date');
        
        
    } catch (error) {
      console.error('Error al obtener el reporte de monitoreos:', error);
      throw new Error('No se pudo obtener el reporte de monitoreos debido a un error en el servidor. ' + error.message);
    }
  }
  
  //guardar las respuestas de formulario y el monitoreo de agente
  async saveMonitoringAndAnswers(data) {
    const {
      monitoringDate,
      id_user_monitor,
      id_user_agent,
      id_form,
      score,
      feedback,
      answers,
    } = data;

    const fecha = monitoringDate || getDateTimeForSQL();

    // Transacción para que todo se guarde o nada
    return await this.knex.transaction(async (trx) => {
     const monitoringId = await trx('monitoring').insert({
        date: fecha,
        score,
        feedback,
        id_user_agent,
        id_user_monitor,
        id_form,
      });

      // Insertar todas las respuestas relacionadas
      const answersToInsert = answers.map((ans) => ({
        question_id: ans.question_id,
        idUser: id_user_agent,
        answer: ans.answer_question,
        date: fecha
      }));

      await trx('answers_form').insert(answersToInsert);

      return { monitoringId, answersCount: answers.length };
    });
  }
 
  async getAllAnswers() {
    try {
      return await this.knex(this.table).select('*');
    } catch (error) {
      console.error('Error al obtener las respuestas:', error);
      throw new Error('No se pudieron obtener las respuestas debido a un error en el servidor.' + error.message);
    }
  }

  async getAnswerById(id) {
    try {
      if (!id) {
        throw new Error('ID de respuesta no proporcionado');
      }
      return await this.knex(this.table).where({ id }).first();
    }catch (error) {
      console.error('Error al obtener la respuesta por ID:', error);
      throw new Error('No se pudo obtener la respuesta debido a un error en el servidor.' + error.message);
    } 
    
  }

  async getAnswersByQuestionId(questionId) {
    try {
      return await this.knex(this.table).where({ question_id: questionId });
    }catch(error) {
      console.error('Error al obtener respuestas por ID de pregunta:', error);
      throw new Error('No se pudieron obtener las respuestas debido a un error en el servidor.' + error.message);
    }
  }

  async updateAnswer(id, data) {
    try {
    await this.knex(this.table).where({ id }).update({
      answer: data.answer,
    });
      return this.getAnswerById(id);
    } catch (error) {
      console.error('Error al actualizar la respuesta:', error);
      throw new Error('No se pudo actualizar la respuesta debido a un error en el servidor.' + error.message);
    }
  }

  async deleteAnswer(id) {
    try {
      return await this.knex(this.table).where({ id }).del();
    } catch (error) {
      console.error('Error al eliminar la respuesta:', error);
      throw new Error('No se pudo eliminar la respuesta debido a un error en el servidor.' + error.message);
    }
  }
}

module.exports = new AnswersFormModel();