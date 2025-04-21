import React, { useState, useEffect } from "react";

//Funcion para recorrer options y marcarlas como seleccionadas o no seleccionadas al editar
function getCorrectOptions(optionsT, indexOption) {
  const numberArray = indexOption.map((str) => parseInt(str, 10));
  let i;
  let options = [];
  for (i = 0; i < optionsT.length; i++) {
    if (numberArray.includes(i)) {
      const x = { text: optionsT[i], checked: true };
      options.push(x);
    } else {
      const x = { text: optionsT[i], checked: false };
      options.push(x);
    }
  }
  return options;
}

function SingleChoiceQuestion({ options, correctAnswer, onChange }) {
  const [localOptions, setLocalOptions] = useState(options);
  const [localCorrectAnswer, setLocalCorrectAnswer] = useState(correctAnswer);

  useEffect(() => {
    setLocalOptions(options);
    setLocalCorrectAnswer(correctAnswer);
  }, [options, correctAnswer]);

  const moreOption = () => {
    const newOptions = [...localOptions, { text: "", checked: false }];
    setLocalOptions(newOptions);
    onChange({ options: newOptions, correctAnswer: localCorrectAnswer });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...localOptions];
    newOptions[index].text = value;
    setLocalOptions(newOptions);
    onChange({ options: newOptions, correctAnswer: localCorrectAnswer });
  };

  const handleCheckboxChange = (index) => {
    const newOptions = localOptions.map((option, i) => ({
      ...option,
      checked: i === index ? !option.checked : false,
    }));
    setLocalOptions(newOptions);

    const newCorrectAnswer = newOptions[index].checked ? index : null;
    setLocalCorrectAnswer(newCorrectAnswer);
    onChange({ options: newOptions, correctAnswer: newCorrectAnswer });
  };

  return (
    <div>
      {localOptions.map((option, index) => (
        <div key={index} className="row m-2 form-group">
          <div className="col-1 p-2">
            <input
              type="checkbox"
              checked={option.checked}
              onChange={() => handleCheckboxChange(index)}
              className="form-check-input"
              style={{ width: "100%", height: "100%" }}
            />
          </div>
          <div className="col">
            <label id="labelAnimation">
              <input
                type="text"
                value={option.text}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder=" "
                className="input-new"
              />
              <span className="labelName">Opción de respuesta</span>
            </label>
          </div>
        </div>
      ))}
      <button onClick={moreOption} className="btn btn-primary m-2">
        + opción
      </button>
    </div>
  );
}

function SingleChoiceQuestionEdit({
  options,
  correctAnswer,
  idToEdit,
  onChange,
}) {
  const [localOptions, setLocalOptions] = useState(options);
  const [localCorrectAnswer, setLocalCorrectAnswer] = useState(correctAnswer);
  console.log("idToEdit", idToEdit);

  useEffect(() => {
    if (options && correctAnswer) {
      const opciones = getCorrectOptions(options, correctAnswer);
      setLocalOptions(opciones);
    }
  }, [idToEdit]);

  useEffect(() => {
    setLocalCorrectAnswer(correctAnswer);
  }, [options, correctAnswer]);

  const moreOption = () => {
    const newOptions = [...localOptions, { text: "", checked: false }];
    setLocalOptions(newOptions);
    onChange({ options: newOptions, correctAnswer: localCorrectAnswer });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...localOptions];
    newOptions[index].text = value;
    setLocalOptions(newOptions);
    onChange({ options: newOptions, correctAnswer: localCorrectAnswer });
  };

  const handleCheckboxChange = (index) => {
    const newOptions = localOptions.map((option, i) => ({
      ...option,
      checked: i === index ? !option.checked : false,
    }));
    setLocalOptions(newOptions);

    const newCorrectAnswer = newOptions[index].checked ? index : null;
    setLocalCorrectAnswer(newCorrectAnswer);
    onChange({ options: newOptions, correctAnswer: newCorrectAnswer });
  };
  const removeOption = (index) => {
    const newOptions = localOptions.filter((_, i) => i !== index);
    setLocalOptions(newOptions);

    const newCorrectAnswers = newOptions
      .map((option, i) => (option.checked ? i : -1))
      .filter((index) => index !== -1);

    setLocalCorrectAnswer(newCorrectAnswers);
    onChange({ options: newOptions, correctAnswers: newCorrectAnswers });
  };

  useEffect(() => {
    const currentCorrectAnswers = localOptions
      .map((option, i) => (option.checked ? i : -1))
      .filter((index) => index !== -1);

    if (
      JSON.stringify(localCorrectAnswer) !==
      JSON.stringify(currentCorrectAnswers)
    ) {
      setLocalCorrectAnswer(currentCorrectAnswers);
      onChange({
        options: localOptions,
        correctAnswers: currentCorrectAnswers,
      });
    }
  }, [localOptions, onChange]);

  return (
    <div>
      {localOptions.map((option, index) => (
        <div key={index} className="row m-2 form-group">
          <div className="col-1 p-2">
            <input
              type="checkbox"
              checked={option.checked}
              onChange={() => handleCheckboxChange(index)}
              className="form-check-input"
              style={{ width: "100%", height: "100%" }}
            />
          </div>
          <div className="col">
            <label id="labelAnimation">
              <input
                type="text"
                value={option.text}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder=" "
                className="input-new"
              />
              <span className="labelName">Opción de respuesta</span>
            </label>
          </div>
          <div className="col-1 me-2">
            <button
              onClick={() => removeOption(index)}
              className="btn btn-rect"
            >
              <i className="fa-solid fa-delete-left"></i>
            </button>
          </div>
        </div>
      ))}
      <button onClick={moreOption} className="btn btn-primary m-2">
        + opción
      </button>
    </div>
  );
}

function MultipleChoiceQuestionEdit({
  options,
  correctAnswers,
  idToEdit,
  onChange,
}) {
  const [localOptions, setLocalOptions] = useState(options);
  const [localCorrectAnswers, setLocalCorrectAnswers] =
    useState(correctAnswers);
  useEffect(() => {
    const opciones = getCorrectOptions(options, correctAnswers);
    setLocalOptions(opciones);
  }, [idToEdit]);

  useEffect(() => {
    setLocalCorrectAnswers(correctAnswers);
  }, [options, correctAnswers]);

  const addOption = () => {
    const newOptions = [...localOptions, { text: "", checked: false }];
    setLocalOptions(newOptions);
    onChange({ options: newOptions, correctAnswers: localCorrectAnswers });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...localOptions];
    newOptions[index].text = value;
    setLocalOptions(newOptions);
    onChange({ options: newOptions, correctAnswers: localCorrectAnswers });
  };

  const handleCheckboxChange = (index) => {
    const newOptions = [...localOptions];
    newOptions[index].checked = !newOptions[index].checked;
    setLocalOptions(newOptions);

    const newCorrectAnswers = newOptions
      .map((option, i) => (option.checked ? i : -1))
      .filter((index) => index !== -1);

    setLocalCorrectAnswers(newCorrectAnswers);
    onChange({ options: newOptions, correctAnswers: newCorrectAnswers });
  };

  const removeOption = (index) => {
    const newOptions = localOptions.filter((_, i) => i !== index);
    setLocalOptions(newOptions);

    const newCorrectAnswers = newOptions
      .map((option, i) => (option.checked ? i : -1))
      .filter((index) => index !== -1);

    setLocalCorrectAnswers(newCorrectAnswers);
    onChange({ options: newOptions, correctAnswers: newCorrectAnswers });
  };
  useEffect(() => {
    const currentCorrectAnswers = localOptions
      .map((option, i) => (option.checked ? i : -1))
      .filter((index) => index !== -1);

    if (
      JSON.stringify(localCorrectAnswers) !==
      JSON.stringify(currentCorrectAnswers)
    ) {
      setLocalCorrectAnswers(currentCorrectAnswers);
      onChange({
        options: localOptions,
        correctAnswers: currentCorrectAnswers,
      });
    }
  }, [localOptions, onChange]);

  return (
    <div>
      {localOptions.map((option, index) => (
        <div key={index} className="row m-2 form-group">
          <div className="col-1 p-2">
            <input
              type="checkbox"
              checked={option.checked}
              onChange={() => handleCheckboxChange(index)}
              className="form-check-input"
              style={{ width: "100%", height: "100%" }}
            />
          </div>
          <div className="col mt-2">
            <label id="labelAnimation">
              <input
                type="text"
                value={option.text}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder=" "
                className="input-new"
              />
              <span className="labelName">Opción de respuesta</span>
            </label>
          </div>
          <div className="col-1 me-2">
            <button
              onClick={() => removeOption(index)}
              className="btn btn-rect"
            >
              <i className="fa-solid fa-delete-left"></i>
            </button>
          </div>
        </div>
      ))}
      <button onClick={addOption} className="btn btn-primary m-2">
        + opción
      </button>
      <div>Respuestas correctas: {localCorrectAnswers.join(", ")}</div>
    </div>
  );
}

function MultipleChoiceQuestion({ options, correctAnswers, onChange }) {
  const [localOptions, setLocalOptions] = useState(options);
  const [localCorrectAnswers, setLocalCorrectAnswers] =
    useState(correctAnswers);

  useEffect(() => {
    setLocalOptions(options);
    setLocalCorrectAnswers(correctAnswers);
  }, [options, correctAnswers]);

  const moreOption = () => {
    const newOptions = [...localOptions, { text: "", checked: false }];
    setLocalOptions(newOptions);
    onChange({ options: newOptions, correctAnswers: localCorrectAnswers });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...localOptions];
    newOptions[index].text = value;
    setLocalOptions(newOptions);
    console.log("MultipleChoice Option Change:", newOptions);
    onChange({ options: newOptions, correctAnswers: localCorrectAnswers });
  };

  const handleCheckboxChange = (index) => {
    const newOptions = [...localOptions];
    newOptions[index].checked = !newOptions[index].checked;
    setLocalOptions(newOptions);
    console.log("MultipleChoice Checkbox Change:", newOptions);

    const newCorrectAnswers = newOptions
      .map((option, i) => (option.checked ? i : -1))
      .filter((index) => index !== -1);

    setLocalCorrectAnswers(newCorrectAnswers);
    onChange({ options: newOptions, correctAnswers: newCorrectAnswers });
  };

  const removeOption = (index) => {
    const newOptions = localOptions.filter((_, i) => i !== index);
    setLocalOptions(newOptions);

    const newCorrectAnswers = newOptions
      .map((option, i) => (option.checked ? i : -1))
      .filter((index) => index !== -1);

    setLocalCorrectAnswers(newCorrectAnswers);
    onChange({ options: newOptions, correctAnswers: newCorrectAnswers });
  };

  useEffect(() => {
    // Solo llama a onChange si las opciones o correctAnswers realmente cambian
    const currentCorrectAnswers = localOptions
      .map((option, i) => (option.checked ? i : -1))
      .filter((index) => index !== -1);

    if (
      JSON.stringify(localCorrectAnswers) !==
      JSON.stringify(currentCorrectAnswers)
    ) {
      setLocalCorrectAnswers(currentCorrectAnswers);
      onChange({
        options: localOptions,
        correctAnswers: currentCorrectAnswers,
      });
    }
  }, [localOptions, onChange]);

  return (
    <div>
      {localOptions.map((option, index) => (
        <div key={index} className="row m-2 form-group">
          <div className="col-1 p-2">
            <input
              type="checkbox"
              checked={option.checked}
              onChange={() => handleCheckboxChange(index)}
              className="form-check-input"
              style={{ width: "100%", height: "100%" }}
            />
          </div>
          <div className="col">
            <label id="labelAnimation">
              <input
                type="text"
                value={option.text}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder=" "
                className="input-new"
              />
              <span className="labelName">Opción de respuesta</span>
            </label>
          </div>
          <div className="col-1 me-2">
            <button
              onClick={() => removeOption(index)}
              className="btn btn-rect"
            >
              <i className="fa-solid fa-delete-left"></i>
            </button>
          </div>
        </div>
      ))}
      <button onClick={moreOption} className="btn btn-primary m-2">
        + opción
      </button>
      <div>Respuestas correctas: {localCorrectAnswers.join(", ")}</div>
    </div>
  );
}

const SelectorQuestion = () => {
  const [activeTab, setActiveTab] = useState("multiple_responses");

  // Para multiple_responses
  const [responses, setResponses] = useState([]);
  const [showFormMultiple, setShowFormMultiple] = useState(false);
  const [newMultipleAnswer, setNewMultipleAnswer] = useState("");

  // Para boolean_select
  const [answers, setAnswers] = useState([]);
  const [questionPrinted, setQuestionPrinted] = useState(false);
  const [showFormBoolean, setShowFormBoolean] = useState(false);
  const [newBooleanAnswer, setNewBooleanAnswer] = useState("");
  const [question, setQuestion] = useState("");

  // Boolean_select functions
  const handleAddAnswer = () => {
    if (newBooleanAnswer.trim() === "") return;
    const nuevaRespuesta = {
      id: Date.now(),
      text: newBooleanAnswer,
      condition: "Sí",
    };
    setAnswers([...answers, nuevaRespuesta]);
    setNewBooleanAnswer("");
    setShowFormBoolean(false);
    setQuestionPrinted(true);
  };

  const handleDeleteAnswer = (id) => {
    const updatedAnswers = answers.filter((a) => a.id !== id);
    setAnswers(updatedAnswers);
    if (updatedAnswers.length === 0) setQuestionPrinted(false);
  };

  const handleConditionChange = (id, value) => {
    const updatedAnswers = answers.map((a) =>
      a.id === id ? { ...a, condition: value } : a
    );
    setAnswers(updatedAnswers);
  };

  // Multiple_responses functions
  const handleAddMultipleResponse = () => {
    if (newMultipleAnswer.trim() === "") return;
    setResponses([...responses, newMultipleAnswer.trim()]);
    setNewMultipleAnswer("");
    setShowFormMultiple(false);
  };

  const handleRemoveResponse = (index) => {
    const updated = responses.filter((_, i) => i !== index);
    setResponses(updated);
  };

  return (
    <div
      className="p-4 border rounded shadow-sm"
      style={{ width: "94%", margin: "auto" }}
    >
      {/* Tabs */}
      <ul
        className="nav nav-tabs mb-3 border-0"
        style={{ flexDirection: "row" }}
      >
        <li className="nav-item">
          <button
            className="nav-link border-0"
            style={{
              backgroundColor:
                activeTab === "boolean_select" ? "#495057" : "#adb5bd",
              color: "white",
              borderRadius: "0.375rem 0.375rem 0 0", // Bordes redondeados arriba
            }}
            onClick={() => setActiveTab("boolean_select")}
          >
            Respuesta única
          </button>
        </li>
        <li className="nav-item">
          <button
            className="nav-link border-0"
            style={{
              backgroundColor: activeTab === "multiple_responses" ? "#495057" : "#adb5bd",
              color: "white",
              borderRadius: "0.375rem 0.375rem 0 0",
              border: "none",
              boxShadow: "none",
              backgroundImage: "none",
              background: `${activeTab === "multiple_responses" ? "#495057" : "#adb5bd"} !important`,
            }} 
            onClick={() => setActiveTab("multiple_responses")}
          >
            Respuestas Abiertas
          </button>
        </li>
      </ul>

      {/* Multiple Responses */}
      {activeTab === "multiple_responses" && (
        <>
          <label className="form-label"></label>
          <ul className="list-group">
            {responses.map((res, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                {res}
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleRemoveResponse(index)}
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>

          {!showFormMultiple ? (
            <button
              className="btn btn-link text-decoration-none p-0"
              onClick={() => setShowFormMultiple(true)}
            >
              + Agregar opción personalizada
            </button>
          ) : (
            <div className="d-flex flex-column gap-2">
              <input
                type="text"
                className="form-control"
                placeholder="Escribe la nueva respuesta"
                value={newMultipleAnswer}
                onChange={(e) => setNewMultipleAnswer(e.target.value)}
              />
              <div className="d-flex justify-content-center gap-2">
                <button
                  className="btn btn-success"
                  onClick={handleAddMultipleResponse}
                >
                  Guardar
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowFormMultiple(false);
                    setNewMultipleAnswer("");
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Select con respuestas creadas */}
          {responses.length > 0 && (
            <div className="mt-4">
              <label className="form-label">
                Selecciona una respuesta guardada:
              </label>
              <select className="form-select">
                {responses.map((res, idx) => (
                  <option key={idx} value={res}>
                    {res}
                  </option>
                ))}
              </select>
            </div>
          )}
        </>
      )}

      {/* Boolean Select */}
      {activeTab === "boolean_select" && (
        <>
          <div className="mb-3">
            {!showFormBoolean ? (
              <button
                className="btn btn-link text-decoration-none p-0"
                onClick={() => setShowFormBoolean(true)}
              >
                + Agregar opción personalizada
              </button>
            ) : (
              <div className="d-flex flex-column gap-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Escribe la nueva respuesta"
                  value={newBooleanAnswer}
                  onChange={(e) => setNewBooleanAnswer(e.target.value)}
                />
                <div className="d-flex justify-content-center gap-2">
                  <button
                    className="btn"
                    style={{
                      backgroundColor: "rgba(175, 14, 110, 0.717)",
                      color: "white",
                    }}
                    onClick={handleAddAnswer}
                  >
                    Guardar
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowFormBoolean(false);
                      setNewBooleanAnswer("");
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>

          {questionPrinted && (
            <>
              <hr />
              <h5 className="fw-bold">{question}</h5>
              <div className="mt-3">
                <label className="form-label">Respuestas guardadas:</label>
                {answers.map((ans) => (
                  <div
                    key={ans.id}
                    className="d-flex align-items-center gap-2 mb-2"
                  >
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteAnswer(ans.id)}
                    >
                      ✕
                    </button>
                    <input
                      type="text"
                      className="form-control"
                      value={ans.text}
                      onChange={(e) =>
                        setAnswers(
                          answers.map((a) =>
                            a.id === ans.id ? { ...a, text: e.target.value } : a
                          )
                        )
                      }
                    />
                    <select
                      className="form-select w-auto"
                      value={ans.condition}
                      onChange={(e) =>
                        handleConditionChange(ans.id, e.target.value)
                      }
                    >
                      <option>Sí</option>
                      <option>No</option>
                    </select>
                  </div>
                ))}
                {answers.length > 0 && (
                  <div className="mt-4">
                    <label className="form-label">
                      Selecciona una respuesta guardada:
                    </label>
                    <select className="form-select">
                      {answers.map((ans) => (
                        <option key={ans.id} value={ans.text}>
                          {ans.text} ({ans.condition})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

function SelectorQuestionEdit({ options, correctAnswer, onChange }) {
  const [localOptions, setLocalOptions] = useState(options);
  const [localCorrectAnswer, setLocalCorrectAnswer] = useState(correctAnswer);

  useEffect(() => {
    setLocalOptions(options);
    setLocalCorrectAnswer(correctAnswer);
  }, [options, correctAnswer]);

  const removeOption = (index) => {
    const newOptions = localOptions.filter((_, i) => i !== index);
    setLocalOptions(newOptions);

    const newCorrectAnswers = newOptions
      .map((option, i) => (option.checked ? i : -1))
      .filter((index) => index !== -1);

    setLocalCorrectAnswer(newCorrectAnswers);
    onChange({ options: newOptions, correctAnswers: newCorrectAnswers });
  };

  // Añadir una nueva opción
  const addOption = () => {
    const newOptions = [...localOptions, { text: "", checked: false }];
    setLocalOptions(newOptions);
    onChange({ options: newOptions, correctAnswer: localCorrectAnswer });
  };

  // Cambiar el valor del texto de una opción
  const handleOptionChange = (index, value) => {
    const newOptions = [...localOptions];
    newOptions[index].text = value;
    setLocalOptions(newOptions);
    onChange({ options: newOptions, correctAnswer: localCorrectAnswer });
  };

  // Cambiar el estado de la opción seleccionada
  const handleCheckboxChange = (index) => {
    const newOptions = localOptions.map((option, i) => ({
      ...option,
      checked: i === index ? !option.checked : option.checked,
    }));
    setLocalOptions(newOptions);

    const newCorrectAnswer = newOptions[index].checked ? index : null;
    setLocalCorrectAnswer(newCorrectAnswer);
    onChange({ options: newOptions, correctAnswer: newCorrectAnswer });
  };

  return (
    <div>
      {localOptions.map((option, index) => (
        <div key={index} className="row m-2 form-group">
          <div className="col-1 p-2">
            <input
              type="checkbox"
              checked={option.checked}
              onChange={() => handleCheckboxChange(index)}
              className="form-check-input"
              style={{ width: "100%", height: "100%" }}
            />
          </div>
          <div className="col">
            <label id="labelAnimation">
              <input
                type="text"
                value={option.text}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder=" "
                className="input-new"
              />
              <span className="labelName">Opción de respuesta</span>
            </label>
          </div>
          <div className="col-1 me-2">
            <button
              onClick={() => removeOption(index)}
              className="btn btn-rect"
            >
              <i className="fa-solid fa-delete-left"></i>
            </button>
          </div>
        </div>
      ))}
      <button onClick={addOption} className="btn btn-primary m-2">
        + opción
      </button>
    </div>
  );
}

export {
  SingleChoiceQuestion,
  MultipleChoiceQuestion,
  MultipleChoiceQuestionEdit,
  SingleChoiceQuestionEdit,
  SelectorQuestion,
  SelectorQuestionEdit,
};
