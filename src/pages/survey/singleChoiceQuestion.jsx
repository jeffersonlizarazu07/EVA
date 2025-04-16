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
  const [question, setQuestion] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newAnswer, setNewAnswer] = useState("");
  const [answers, setAnswers] = useState([]);
  const [questionPrinted, setQuestionPrinted] = useState(false);

  const handleAddAnswer = () => {
    if (newAnswer.trim() === "") return;
    const nuevaRespuesta = {
      id: Date.now(),
      text: newAnswer,
      condition: "Sí",
    };
    setAnswers([...answers, nuevaRespuesta]);
    setNewAnswer("");
    setShowForm(false);
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

  return (
    <div
      className="p-4 border rounded shadow-sm"
      style={{ width: "94%", margin: "auto" }}
    >
      <div className="mb-3">
        {!showForm ? (
          <button
            className="btn btn-link text-decoration-none p-0"
            onClick={() => setShowForm(true)}
          >
            + Agregar opción personalizada
          </button>
        ) : (
          <div className="d-flex flex-column gap-2">
            <input
              type="text"
              className="form-control"
              placeholder="Escribe la nueva respuesta"
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
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
                  setShowForm(false);
                  setNewAnswer("");
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
