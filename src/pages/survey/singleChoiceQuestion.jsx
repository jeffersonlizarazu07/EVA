import React, { useState, useEffect } from 'react';

//Funcion para recorrer options y marcarlas como seleccionadas o no seleccionadas al editar
function getCorrectOptions (optionsT, indexOption){
  const numberArray = indexOption.map(str => parseInt(str, 10));
  let i
  let options=[]
  for(i=0; i<optionsT.length; i++){
 
    if (numberArray.includes(i)) {
      const x = { text: optionsT[i], checked: true };
      options.push(x);
    } else {
      const x = { text: optionsT[i], checked: false };
      options.push(x);
    }
  }
  return options
}


function SingleChoiceQuestion({ options, correctAnswer, onChange }) {
  const [localOptions, setLocalOptions] = useState(options);
  const [localCorrectAnswer, setLocalCorrectAnswer] = useState(correctAnswer);

  useEffect(() => {
    setLocalOptions(options);
    setLocalCorrectAnswer(correctAnswer);
  }, [options, correctAnswer]);

  const moreOption = () => {
    const newOptions = [...localOptions, { text: '', checked: false }];
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
        <div key={index} className='row m-2 form-group'>
          <div className='col-1 p-2'>
            <input
              type="checkbox"
              checked={option.checked}
              onChange={() => handleCheckboxChange(index)}
              className='form-check-input'
              style={{ width: "100%", height: "100%" }}
            />
          </div>
          <div className='col'>
            <label id="labelAnimation">
              <input
                type="text"
                value={option.text}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder=" "
                className='input-new'
              />
              <span className="labelName">Opción de respuesta</span>
            </label>
          </div>
        </div>
      ))}
      <button onClick={moreOption} className='btn btn-primary m-2'>+ opción</button>
    </div>
  );
}

function SingleChoiceQuestionEdit({options,correctAnswer,idToEdit, onChange}){
  const [localOptions, setLocalOptions] = useState(options);
  const [localCorrectAnswer, setLocalCorrectAnswer] = useState(correctAnswer);
  console.log("idToEdit",idToEdit)

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
    const newOptions = [...localOptions, { text: '', checked: false }];
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
      .map((option, i) => option.checked ? i : -1)
      .filter(index => index !== -1);

    setLocalCorrectAnswer(newCorrectAnswers);
    onChange({ options: newOptions, correctAnswers: newCorrectAnswers });
  };

  useEffect(() => {
    const currentCorrectAnswers = localOptions
      .map((option, i) => option.checked ? i : -1)
      .filter(index => index !== -1);

    if (JSON.stringify(localCorrectAnswer) !== JSON.stringify(currentCorrectAnswers)) {
      setLocalCorrectAnswer(currentCorrectAnswers);
      onChange({ options: localOptions, correctAnswers: currentCorrectAnswers });
    }
  }, [localOptions, onChange]);


  return (
    <div>
      {localOptions.map((option, index) => (
        <div key={index} className='row m-2 form-group'>
          <div className='col-1 p-2'>
            <input
              type="checkbox"
              checked={option.checked}
              onChange={() => handleCheckboxChange(index)}
              className='form-check-input'
              style={{ width: "100%", height: "100%" }}
            />
          </div>
          <div className='col'>
            <label id="labelAnimation">
              <input
                type="text"
                value={option.text}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder=" "
                className='input-new'
              />
              <span className="labelName">Opción de respuesta</span>
            </label>
          </div>
          <div className='col-1 me-2'>
            <button
              onClick={() => removeOption(index)}
              className='btn btn-rect'
            >
              <i className="fa-solid fa-delete-left"></i>
            </button>
          </div>
        </div>
      ))}
      <button onClick={moreOption} className='btn btn-primary m-2'>+ opción</button>
    </div>
  );
}

function MultipleChoiceQuestionEdit({options, correctAnswers, idToEdit, onChange}){
  const [localOptions, setLocalOptions] = useState(options);
  const [localCorrectAnswers, setLocalCorrectAnswers] = useState(correctAnswers);
  useEffect(() => {
    
    const opciones = getCorrectOptions(options, correctAnswers);
    setLocalOptions(opciones);
  }, [idToEdit]);
  
  useEffect(() => {
    setLocalCorrectAnswers(correctAnswers);
  }, [options, correctAnswers]);
  
  const addOption = () => {
    const newOptions = [...localOptions, { text: '', checked: false }];
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
      .map((option, i) => option.checked ? i : -1)
      .filter(index => index !== -1);

    setLocalCorrectAnswers(newCorrectAnswers);
    onChange({ options: newOptions, correctAnswers: newCorrectAnswers });
  };

  const removeOption = (index) => {
    const newOptions = localOptions.filter((_, i) => i !== index);
    setLocalOptions(newOptions);

    const newCorrectAnswers = newOptions
      .map((option, i) => option.checked ? i : -1)
      .filter(index => index !== -1);

    setLocalCorrectAnswers(newCorrectAnswers);
    onChange({ options: newOptions, correctAnswers: newCorrectAnswers });
  };
  useEffect(() => {
    const currentCorrectAnswers = localOptions
      .map((option, i) => option.checked ? i : -1)
      .filter(index => index !== -1);

    if (JSON.stringify(localCorrectAnswers) !== JSON.stringify(currentCorrectAnswers)) {
      setLocalCorrectAnswers(currentCorrectAnswers);
      onChange({ options: localOptions, correctAnswers: currentCorrectAnswers });
    }
  }, [localOptions, onChange]);


  return (
    <div>
       {localOptions.map((option, index) => (
        <div key={index} className='row m-2 form-group'>
          <div className='col-1 p-2'>
            <input
              type="checkbox"
              checked={option.checked}
              onChange={() => handleCheckboxChange(index)}
              className='form-check-input'
              style={{ width: "100%", height: "100%" }}
            />
          </div>
          <div className='col mt-2'>
            <label id="labelAnimation">
              <input
                type="text"
                value={option.text}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder=" "
                className='input-new'
              />
              <span className="labelName">Opción de respuesta</span>
            </label>
          </div>
          <div className='col-1 me-2'>
            <button
              onClick={() => removeOption(index)}
              className='btn btn-rect'
            >
              <i className="fa-solid fa-delete-left"></i>
            </button>
          </div>
        </div>
      ))}
      <button onClick={addOption} className='btn btn-primary m-2'>+ opción</button>
      <div>
        Respuestas correctas: {localCorrectAnswers.join(', ')}
      </div> 
     
    </div>
  );



}

function MultipleChoiceQuestion({ options, correctAnswers, onChange }) {
  const [localOptions, setLocalOptions] = useState(options);
  const [localCorrectAnswers, setLocalCorrectAnswers] = useState(correctAnswers);

  useEffect(() => {
    setLocalOptions(options);
    setLocalCorrectAnswers(correctAnswers);
  }, [options, correctAnswers]);

  const moreOption = () => {
    const newOptions = [...localOptions, { text: '', checked: false }];
    setLocalOptions(newOptions);
    onChange({ options: newOptions, correctAnswers: localCorrectAnswers });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...localOptions];
    newOptions[index].text = value;
    setLocalOptions(newOptions);
    console.log('MultipleChoice Option Change:', newOptions);
    onChange({ options: newOptions, correctAnswers: localCorrectAnswers });
  };

  const handleCheckboxChange = (index) => {
    const newOptions = [...localOptions];
    newOptions[index].checked = !newOptions[index].checked;
    setLocalOptions(newOptions);
    console.log('MultipleChoice Checkbox Change:', newOptions);

    const newCorrectAnswers = newOptions
      .map((option, i) => option.checked ? i : -1)
      .filter(index => index !== -1);

    setLocalCorrectAnswers(newCorrectAnswers);
    onChange({ options: newOptions, correctAnswers: newCorrectAnswers });
  };

  const removeOption = (index) => {
    const newOptions = localOptions.filter((_, i) => i !== index);
    setLocalOptions(newOptions);

    const newCorrectAnswers = newOptions
      .map((option, i) => option.checked ? i : -1)
      .filter(index => index !== -1);

    setLocalCorrectAnswers(newCorrectAnswers);
    onChange({ options: newOptions, correctAnswers: newCorrectAnswers });
  };

  useEffect(() => {
    // Solo llama a onChange si las opciones o correctAnswers realmente cambian
    const currentCorrectAnswers = localOptions
      .map((option, i) => option.checked ? i : -1)
      .filter(index => index !== -1);

    if (JSON.stringify(localCorrectAnswers) !== JSON.stringify(currentCorrectAnswers)) {
      setLocalCorrectAnswers(currentCorrectAnswers);
      onChange({ options: localOptions, correctAnswers: currentCorrectAnswers });
    }
  }, [localOptions, onChange]);

  return (
    <div>
      {localOptions.map((option, index) => (
        <div key={index} className='row m-2 form-group'>
          <div className='col-1 p-2'>
            <input
              type="checkbox"
              checked={option.checked}
              onChange={() => handleCheckboxChange(index)}
              className='form-check-input'
              style={{ width: "100%", height: "100%" }}
            />
          </div>
          <div className='col'>
            <label id="labelAnimation">
              <input
                type="text"
                value={option.text}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder=" "
                className='input-new'
              />
              <span className="labelName">Opción de respuesta</span>
            </label>
          </div>
          <div className='col-1 me-2'>
            <button
              onClick={() => removeOption(index)}
              className='btn btn-rect'
            >
              <i className="fa-solid fa-delete-left"></i>
            </button>
          </div>
        </div>
      ))}
      <button onClick={moreOption} className='btn btn-primary m-2'>+ opción</button>
      <div>
        Respuestas correctas: {localCorrectAnswers.join(', ')}
      </div>
    </div>
  );
}


export {  SingleChoiceQuestion,  MultipleChoiceQuestion,MultipleChoiceQuestionEdit,SingleChoiceQuestionEdit};
