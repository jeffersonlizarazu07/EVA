import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  SingleChoiceQuestion,
  MultipleChoiceQuestion,
  MultipleChoiceQuestionEdit,
  SingleChoiceQuestionEdit,
  SelectorQuestion,
  SelectorQuestionEdit,
} from "../../pages/survey/singleChoiceQuestion";

import {
  Textfield_s,
  SingleChoiceView,
  MultipleChoiceView,
} from "../../pages/survey/questions";
import "../../assets/css/survey.css";
import "../../assets/css/surveyBlocks.css";

const ModalSurveyBlocks = ({
  operation,
  title,
  descriptionText,
  questionsList,
  handleInputChange,
  singleChoiceData,
  multipleChoiceData,
  selectorData,
  handleSingleChoiceChange,
  handleMultipleChoiceChange,
  handleSelectorChange,
  isChecked,
  listConditional,
  valueConditional,
  conditionalHandleChange,
  error,
  validar,
  idToEdit,
  id_form,
  areAllFieldsCompleted,
  handleCancel,
  addNewQuestion,
  questionCountInput,
  setQuestionCountInput,
  nombreInput,
  ponderacionInput,
  posicionInput,
  positionType,
  referenceBlockId,
  data,
  migrateQuestionData,
  setPositionType,
}) => {
  return (
    <div
      className="modal fade"
      id="modalManageQuestion"
      tabIndex="-1"
      aria-labelledby="staticBackdropLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-xl modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="text-start m-2 modal-title">
              {title || "Crear Bloque de Formulario"}
            </h5>
          </div>
          <div className="modal-body">
            <div className="row position-relative">
              {/* Columna izquierda */}
              <div className="col-md-6 p-3">
                <small>
                  <p className="text-start ms-2 text-secondary">
                    {descriptionText}
                  </p>
                </small>

                <div className="form-group m-2 mt-2 mb-4">
                  <label id="labelAnimation" htmlFor="question">
                    <input
                      type="text"
                      name="question"
                      id="question"
                      className="input-new"
                      placeholder=" "
                      value={nombreInput.input}
                      onChange={(e) => nombreInput.handleChange(e.target.value)}
                      required
                    />
                    <span className="labelName">Nombre de bloque</span>
                  </label>
                </div>

                <div className="form-group m-2 mt-2 mb-4">
                  <label id="labelAnimation" htmlFor="question">
                    <input
                      type="number"
                      name="question"
                      id="question"
                      className="input-new"
                      placeholder=" "
                      value={ponderacionInput.input}
                      onChange={(e) =>
                        ponderacionInput.handleChange(e.target.value)
                      }
                      required
                    />
                    <span className="labelName">Ponderación</span>
                  </label>
                </div>

                <div className="form-group m-2 mt-2 mb-4">
                  <label id="labelAnimation" htmlFor="question">
                    <input
                      type="text"
                      name="question"
                      id="question"
                      className="input-new"
                      placeholder=" "
                      value={posicionInput.input}
                      onChange={(e) =>
                        posicionInput.handleChange(e.target.value)
                      }
                      required
                    />
                    <span className="labelName">Posición del bloque</span>
                  </label>
                </div>

                <div className="block-position mb-4">
                  <h5 className="mb-3">Posición del bloque</h5>
                  <div className="d-flex gap-3 m-2">
                    <div className="form-group flex-fill">
                      <label
                        htmlFor="positionTypeSelect"
                        className="form-label"
                      ></label>
                      <select
                        id="positionTypeSelect"
                        className="form-select"
                        value={positionType}
                        onChange={(e) =>
                          setPositionType(e.target.value.toLowerCase())
                        }
                      >
                        <option value="" hidden>
                          Seleccione posición
                        </option>
                        <option value="before">⬆️ Antes de</option>
                        <option value="after">⬇️ Después de</option>
                      </select>
                    </div>
                    <div className="form-group flex-fill">
                      <label
                        htmlFor="referenceBlock"
                        className="form-label"
                      ></label>
                      <select
                        id="referenceBlock"
                        className="form-select"
                        value={referenceBlockId || ""}
                        onChange={(e) => setReferenceBlockId(e.target.value)}
                        disabled={!positionType}
                      >
                        <option value="" hidden>
                          Seleccione bloque
                        </option>
                        {data.map((bloque) => (
                          <option key={bloque.id} value={bloque.id}>
                            {`Bloque ${bloque.posicion}: ${
                              bloque.nombreBloque || "Sin nombre"
                            }`}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {positionType && referenceBlockId && (
                    <div className="alert alert-info mt-3">
                      <i className="fa-solid fa-info-circle me-2"></i>
                      El bloque se colocará{" "}
                      {positionType === "before"
                        ? "antes del"
                        : "después del"}{" "}
                      bloque seleccionado y se actualizarán automáticamente las
                      posiciones de los demás bloques.
                    </div>
                  )}
                </div>
              </div>

              {/* Línea divisoria */}
              <div className="vertical-divider"></div>

              {/* Columna derecha */}
              <div className="col-md-6">
                {/* Botón para agregar preguntas */}
                <div className="card-tools row ms-2">
                  {/* Input para cantidad de preguntas */}
                  <div className="col-sm-5">
                    <div className="form-group">
                      <label htmlFor="questionConditional" id="labelAnimation">
                        <input
                          type="number"
                          className="input-new conditionalQuestionSelect"
                          name="questionConditional"
                          id="questionConditional"
                          value={questionCountInput}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value)) {
                              setQuestionCountInput(value);
                            }
                          }}
                        />
                        <span className="labelName">Número de preguntas</span>
                      </label>
                    </div>
                  </div>
                  <div className="col-auto">
                    <button
                      className="btn fw-bold btn-sm add-question-btn p-2"
                      onClick={addNewQuestion}
                    >
                      + Pregunta
                    </button>
                  </div>
                </div>

                {questionsList.map((q, index) => (
                  <div key={index} className="shadowbox5 p-2 m-3">
                    {/* Input para escribir el texto de la pregunta */}
                    <div className="form-group m-2">
                      <h5>Pregunta {index + 1}</h5>
                      <label id="labelAnimation">
                        <input
                          type="text"
                          className="input-new"
                          placeholder=""
                          value={q.text || ""}
                          onChange={(e) =>
                            handleInputChange(index, "text", e.target.value)
                          }
                        />
                        <span className="labelName">Texto de la pregunta:</span>
                      </label>
                    </div>

                    {/* Tipo de pregunta */}
                    <div className="form-group m-2">
                      <label
                        htmlFor={`questionType_${index}`}
                        id="labelAnimation"
                      >
                        <select
                          className="input-new text-center"
                          name={`questionType_${index}`}
                          id={`questionType_${index}`}
                          value={q.type}
                          onChange={(e) => {
                            const newType = e.target.value;
                            const oldType = q.type;

                            // Actualizar el tipo
                            handleInputChange(index, "type", newType);

                            // Si cambió el tipo, limpiar datos del tipo anterior
                            if (newType !== oldType) {
                              // Limpiar todos los datos específicos de tipo
                              handleInputChange(index, "selectorOptions", []);
                              handleInputChange(
                                index,
                                "selectorSelectedOption",
                                ""
                              );
                              handleInputChange(index, "checkboxOptions", []);
                              handleInputChange(
                                index,
                                "checkboxCorrectAnswers",
                                []
                              );
                              handleInputChange(index, "textfieldValue", "");
                              handleInputChange(index, "yesNoValue", "");
                              handleInputChange(index, "type", e.target.value);
                            }
                          }}
                        >
                          <option value="" disabled>
                            Seleccione opción
                          </option>
                          <option value="selector_opt">Seleccionador</option>
                          <option value="check_opt">Selección múltiple</option>
                          <option value="textfield_s">Campo de texto</option>
                        </select>
                        <span className="labelName">Tipo de pregunta:</span>
                      </label>
                    </div>

                    {/* Lógica para diferentes tipos de preguntas */}
                    {q.type === "selector_opt" && operation === 1 && (
                      <SelectorQuestion
                        options={selectorData.options}
                        selectedOption={selectorData.selectedOption}
                        onChange={handleSelectorChange}
                      />
                    )}

                    {operation === 1 && (
                      <div className="mt-2 mb-2">
                        {q.type === "textfield_s" && <Textfield_s />}
                        (
                        <SingleChoiceQuestion
                          options={singleChoiceData.options}
                          correctOption={singleChoiceData.correctAnswer}
                          onChange={handleSingleChoiceChange}
                        />
                        )
                        {q.type === "check_opt" && (
                          <MultipleChoiceQuestion
                            options={multipleChoiceData.options || []}
                            correctAnswers={
                              Array.isArray(multipleChoiceData.correctAnswers)
                                ? multipleChoiceData.correctAnswers
                                : []
                            }
                            onChange={handleMultipleChoiceChange}
                          />
                        )}
                      </div>
                    )}

                    {operation === 2 && (
                      <>
                        {/* Selector */}
                        {q.type === "selector_opt" && (
                          <div>
                            <SelectorQuestionEdit
                              options={q.selectorOptions || q.options || []}
                              selectedOption={
                                q.selectorSelectedOption || q.selected_answer
                              }
                              onChange={(data) => {
                                handleInputChange(
                                  index,
                                  "selectorOptions",
                                  data.options
                                );
                                handleInputChange(
                                  index,
                                  "selectorSelectedOption",
                                  data.selectedOption
                                );
                                // Limpiar datos de otros tipos si cambiaron
                                if (q.type !== "selector_opt") {
                                  handleInputChange(
                                    index,
                                    "checkboxOptions",
                                    []
                                  );
                                  handleInputChange(
                                    index,
                                    "checkboxCorrectAnswers",
                                    []
                                  );
                                }
                              }}
                            />
                            {/* Vista de respuesta seleccionada */}
                            {(q.selectorSelectedOption ||
                              q.selected_answer) && (
                              <div className="mt-3 p-3 bg-light border rounded">
                                <h6 className="text-muted mb-2">
                                  Respuesta seleccionada:
                                </h6>
                                <div className="alert alert-success mb-0">
                                  <i className="fa-solid fa-check-circle me-2"></i>
                                  <strong>
                                    {q.selectorSelectedOption ||
                                      q.selected_answer}
                                  </strong>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Checkbox */}
                        {q.type === "check_opt" && (
                          <div>
                            <MultipleChoiceQuestionEdit
                              key={`selector-${index}-${idToEdit}`} // forzar rerender al cambiar bloque
                              options={(q.checkboxOptions || []).map((opt) =>
                                typeof opt === "object" ? opt.text : opt
                              )}
                              correctAnswers={
                                Array.isArray(q.checkboxCorrectAnswers)
                                  ? q.checkboxCorrectAnswers
                                  : q.selected_answer?.split(",") || []
                              }
                              idToEdit={idToEdit}
                              onChange={(data) => {
                                handleInputChange(
                                  index,
                                  "checkboxOptions",
                                  data.options.map((text) => ({ text }))
                                );
                                handleInputChange(
                                  index,
                                  "checkboxCorrectAnswers",
                                  data.correctAnswers
                                );
                                // Limpiar datos de otros tipos
                                if (q.type !== "check_opt") {
                                  handleInputChange(
                                    index,
                                    "selectorOptions",
                                    []
                                  );
                                  handleInputChange(
                                    index,
                                    "selectorSelectedOption",
                                    ""
                                  );
                                }
                              }}
                            />
                            {/* Vista de respuestas correctas */}
                            {q.checkboxCorrectAnswers &&
                              q.checkboxCorrectAnswers.length > 0 && (
                                <div className="mt-3 p-3 bg-light border rounded">
                                  <h6 className="text-muted mb-2">
                                    Respuestas correctas:
                                  </h6>
                                  <div className="d-flex flex-wrap gap-2">
                                    {q.checkboxCorrectAnswers.map(
                                      (answerIndex, idx) => (
                                        <div
                                          key={idx}
                                          className="alert alert-success py-2 px-3 mb-0 small"
                                        >
                                          <i className="fa-solid fa-check me-2"></i>
                                          <strong>
                                            {q.checkboxOptions &&
                                            q.checkboxOptions[answerIndex]
                                              ? typeof q.checkboxOptions[
                                                  answerIndex
                                                ] === "object"
                                                ? q.checkboxOptions[answerIndex]
                                                    .text
                                                : q.checkboxOptions[answerIndex]
                                              : `Opción ${answerIndex + 1}`}
                                          </strong>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}
                          </div>
                        )}

                        {/* Campo texto */}
                        {q.type === "textfield_s" && (
                          <div>
                            <Textfield_s
                              value={
                                q.textfieldValue || q.selected_answer || ""
                              }
                              onChange={(val) => {
                                handleInputChange(index, "textfieldValue", val);
                                // Limpiar datos de otros tipos
                                handleInputChange(index, "selectorOptions", []);
                                handleInputChange(
                                  index,
                                  "selectorSelectedOption",
                                  ""
                                );
                                handleInputChange(index, "checkboxOptions", []);
                                handleInputChange(
                                  index,
                                  "checkboxCorrectAnswers",
                                  []
                                );
                              }}
                            />
                            {/* Vista de respuesta */}
                            {(q.textfieldValue || q.selected_answer) && (
                              <div className="mt-3 p-3 bg-light border rounded">
                                <h6 className="text-muted mb-2">
                                  Respuesta guardada:
                                </h6>
                                <div className="alert alert-info mb-0">
                                  <i className="fa-solid fa-edit me-2"></i>
                                  {q.textfieldValue || q.selected_answer}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Sí / No */}
                        {q.type === "yes_no" && (
                          <div>
                            <Yes_no
                              value={q.yesNoValue || q.selected_answer || ""}
                              onChange={(val) => {
                                handleInputChange(index, "yesNoValue", val);
                                // Limpiar datos de otros tipos
                                handleInputChange(index, "selectorOptions", []);
                                handleInputChange(
                                  index,
                                  "selectorSelectedOption",
                                  ""
                                );
                                handleInputChange(index, "checkboxOptions", []);
                                handleInputChange(
                                  index,
                                  "checkboxCorrectAnswers",
                                  []
                                );
                              }}
                            />
                            {/* Vista de respuesta */}
                            {(q.yesNoValue || q.selected_answer) && (
                              <div className="mt-3 p-3 bg-light border rounded">
                                <h6 className="text-muted mb-2">
                                  Respuesta seleccionada:
                                </h6>
                                <div
                                  className={`alert mb-0 ${
                                    (q.yesNoValue || q.selected_answer) === "Sí"
                                      ? "alert-success"
                                      : "alert-danger"
                                  }`}
                                >
                                  <i
                                    className={`fa-solid ${
                                      (q.yesNoValue || q.selected_answer) ===
                                      "Sí"
                                        ? "fa-thumbs-up"
                                        : "fa-thumbs-down"
                                    } me-2`}
                                  ></i>
                                  <strong>
                                    {q.yesNoValue || q.selected_answer}
                                  </strong>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}

                    {error && (
                      <p className="text-danger text-center">{error}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Footer del modal */}
          <div className="modal-footer">
            <button
              className="btn bg-gradient-guardar mr-2"
              id="btn-send-survey"
              onClick={() => validar(idToEdit, id_form)}
              disabled={!areAllFieldsCompleted()}
            >
              Guardar
            </button>
            <button
              className="btn btn-secondary"
              type="button"
              data-bs-dismiss="modal"
              id="btnClose"
              onClick={handleCancel}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalSurveyBlocks;
