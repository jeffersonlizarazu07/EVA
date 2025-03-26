import React from 'react';
import { SingleChoiceQuestion } from './SingleChoiceQuestion';

export const Question = ({ question, onUpdate, openModal, deleteQuestion, config, updateSurveyQuestions, t }) => {
  const renderQuestionContent = () => {
    switch (question.type) {
      case 'range_onetofive':
        return (
          <div className="input-group justify-content-center">
            <div className="me-2">
              <p className="ms-2 fw-normal fs-6">Muy insatisfecho</p>
            </div>
            <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
              {Array.from({ length: 5 }, (_, i) => i + 1).map(value => (
                <a key={value} data-bs-toggle="tooltip" data-bs-title={`Satisfacción ${value}`}>
                  <input type="radio" className="btn-check" name={`satisfaction-${question.id}`} id={`satisfaccion${value}`} autoComplete="off" value={value}/>
                  <label className={`btn ${value < 3 ? 'btn-outline-danger' : value === 3 ? 'btn-outline-primary' : 'btn-outline-success'}`} htmlFor={`satisfaccion${value}`}>{value}</label>
                </a>
              ))}
            </div>
            <div className="ms-2">
              <p className="ms-2 fw-normal fs-6">Muy satisfecho</p>
            </div>
          </div>
        );
      case 'range_zerototen':
        return (
          <div className="input-group justify-content-center">
            <div className="me-2">
              <p className="ms-2 fw-normal fs-6">Nada probable</p>
            </div>
            <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
              {Array.from({ length: 11 }, (_, i) => i).map(value => (
                <a key={value} data-bs-toggle="tooltip" data-bs-title={`Probabilidad ${value}`}>
                  <input type="radio" className="btn-check" name={`probability-${question.id}`} id={`recomendar${value}`} autoComplete="off" value={value}/>
                  <label className={`btn ${value < 6 ? 'btn-outline-danger' : value < 8 ? 'btn-outline-primary' : 'btn-outline-success'}`} htmlFor={`recomendar${value}`}>{value}</label>
                </a>
              ))}
            </div>
            <div className="me-2">
              <p className="ms-2 fw-normal fs-6">Muy probable</p>
            </div>
          </div>
        );
      case 'range_difficulty':
        return (
          <div className="input-group justify-content-center">
            <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
              {['Muy difícil', 'Difícil', 'Ni fácil/ni difícil', 'Fácil', 'Muy fácil'].map((value, index) => (
                <React.Fragment key={index}>
                  <input type="radio" className="btn-check" name={`difficulty-${question.id}`} id={`dificultad${index + 1}`} autoComplete="off" value={value}/>
                  <label className={`btn ${index < 2 ? 'btn-outline-danger' : index === 2 ? 'btn-outline-primary' : 'btn-outline-success'}`} htmlFor={`dificultad${index + 1}`}>{value}</label>
                </React.Fragment>
              ))}
            </div>
          </div>
        );
      case 'yes_no':
        return (
          <div className="input-group justify-content-center">
            <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
              <input type="radio" className="btn-check" name={`yes_no-${question.id}`} id="si_no1" autoComplete="off" value="NO"/>
              <label className="btn btn-outline-danger" htmlFor="si_no1">NO</label>
              <input type="radio" className="btn-check" name={`yes_no-${question.id}`} id="si_no2" autoComplete="off" value="SI"/>
              <label className="btn btn-outline-success" htmlFor="si_no2">SI</label>
            </div>
          </div>
        );
      case 'range_emoji':
        return (
          <div className="input-group justify-content-center">
            <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
              {['😐', '☹', '🙂', '😄', '😊'].map((emoji, index) => (
                <React.Fragment key={index}>
                  <input type="radio" className="btn-check" autoComplete="off" value={emoji} id={`emoji${index + 1}`} name={`emojis-${question.id}`}/>
                  <label className={`btn ${index < 1 ? 'btn-outline-danger' : index < 2 ? 'btn-outline-danger' : index < 3 ? 'btn-outline-primary' : 'btn-outline-success'}`} htmlFor={`emoji${index + 1}`}>{emoji}</label>
                </React.Fragment>
              ))}
            </div>
          </div>
        );
      case 'radio_opt':
        return (
          <SingleChoiceQuestion
            key={question.id}
            question={question}
            onUpdate={(updatedQuestion) => onUpdate(question.id, updatedQuestion)}
          />
        );
      default:
        return (
          <div className="form-group">
            <textarea name="" id="" cols="30" rows="4" className="form-control" placeholder="Escriba su respuesta aquí..."></textarea>
          </div>
        );
    }
  };

  return (
    <div key={question.id} className="callout callout-info">
      <div className="row">
        <div className="col-md-12">
        </div>
      </div>
      <div className="d-flex justify-content-between">
        <h5 className='mt-2'>{question.question}</h5>
        <div className="dropdown">
          <a className="btn dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            <i className="fa-solid fa-ellipsis-vertical"></i>
          </a>
          <ul className="dropdown-menu">
            <li><button className="dropdown-item" type='button' data-bs-toggle="modal" data-bs-target="#modalManageQuestion" onClick={() => openModal(2, question.id, question)}>Editar</button></li>
            <li><button className="dropdown-item" type='button' onClick={() => deleteQuestion(question, config, updateSurveyQuestions, t)}>Eliminar</button></li>
          </ul>
        </div>
      </div>
      {renderQuestionContent()}
    </div>
  );
};
