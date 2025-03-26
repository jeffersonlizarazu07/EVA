
import { useState,useEffect } from "react";

//Todos los tipos de pregunta manejan sus estados dependiendo al componente que se este nllamando, en el caso de preguntas 1-5 0-10 se manejan con
//Range selector, en casos como respuest aunica o seleccion multiple se manejan bajo SingleSelector y MultipleSelector respectivamente, donde se muestran las opciones
//y se envian la opcion marcada u opciones marcadas
function RangeSelector({ range, labels, name, change }) {
    return (
      <div className="input-group justify-content-center  mb-4">
        {labels=="Na"?"":( <div className="ms-2">
          <p className="me-2 fw-bold fs-6 mt-2 redIncorrect">{labels.min}</p>
        </div>)}
       
        <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
          {range.map((item, index) => (
            <a key={index} data-bs-toggle="tooltip" data-bs-title={item.tooltip} className='m-1'>
              <input
                type="radio"
                className="btn-check"
                name={name}
                id={`${name}${item.value}`}
                autoComplete="off"
                value={item.value}
                onChange={change}
              />
              <label className={`btn btn-outline-${item.color}`} htmlFor={`${name}${item.value}`}>
                {item.label}
              </label>
            </a>
          ))}
        </div>
        {labels=="Na"?"":( <div className="ms-2">
          <p className="ms-2 fw-bold fs-6 mt-2 greenCorrect">{labels.max}</p>
        </div>)}
       
      </div>
    );
  }
function SingleSelector({answers,name, change}){
    const availableAnswers= answers.split(",")

    return (
      <div className=" mb-4">
        {availableAnswers.map((item,index) => (
            <div key={index} className="row">
                <div className="col text-center ">
                    <div className="text-start p-2 ms-4 m-2">
                        <input  type="radio"  className="form-check-input" onChange={change}     value={item}   name={name} />
                        <label className="form-check-label ms-2 fw-semibold" >{item}</label>
                    </div>
                </div>
            </div>
        ))}
      </div>)
}

function MultipleSelector({ answers, change, id }) {
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [indicesString, setSelectedIndicesStrn]=useState()
  const availableAnswers = answers.split(",");

  const handleCheckboxChange = (item) => {
    const newSelectedIndices = selectedIndices.includes(item)
      ? selectedIndices.filter((i) => i !== item) // Si ya está seleccionado, lo removemos
      : [...selectedIndices, item]; // Si no está seleccionado, lo agregamos

    setSelectedIndices(newSelectedIndices);
    const selectedIndicesString = newSelectedIndices.join(",");
    setSelectedIndicesStrn(selectedIndicesString);
    // Pasar el nuevo estado (cadena separada por comas) a la función change
    change(event,selectedIndicesString, id);
  };
  useEffect(()=>
    {
    console.log(indicesString)
  },[indicesString])
 
  return (
    <div className="mb-4">
      {availableAnswers.map((item, index) => (
        <div key={index} className="row">
          <div className="col text-center">
            <div className="text-start p-2 ms-4 m-2">
              <input
                type="checkbox"
                className="form-check-input"
                onChange={() => handleCheckboxChange(item)}
                checked={selectedIndices.includes(item)}
                value={item}
              />
              <label className="form-check-label ms-2 fw-semibold ">{item}</label>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}


//Las funciones que continuan a este comentario sirven para renderizar condicionalmente los diferentes tipos de pregunta en el componente padre;
function Range_zerototen_survey({id,change}) {
    const range = [
      { label: '0', value: 0, tooltip: 'Nada probable', color: 'danger' },
      { label: '1', value: 1, tooltip: 'Nada probable', color: 'danger' },
      { label: '2', value: 2, tooltip: 'Nada probable', color: 'danger' },
      { label: '3', value: 3, tooltip: 'Nada probable', color: 'danger' },
      { label: '4', value: 4, tooltip: 'Nada probable', color: 'danger' },
      { label: '5', value: 5, tooltip: 'Nada probable', color: 'danger' },
      { label: '6', value: 6, tooltip: 'Nada probable', color: 'danger' },
      { label: '7', value: 7, tooltip: 'Neutro', color: 'warning' },
      { label: '8', value: 8, tooltip: 'Neutro', color: 'warning' },
      { label: '9', value: 9, tooltip: 'Muy probable', color: 'success' },
      { label: '10', value: 10, tooltip: 'Muy probable', color: 'success' },
    ];
  
    const labels = { min: 'Nada probable', max: 'Muy probable' };
  
    return <RangeSelector change={change} range={range} labels={labels} name={`recomendar_${id}`} />;
  }


function Range_onetofive_survey({id,change}) {
    const range = [
      { label: '1', value: 1, tooltip: 'Insatisfecho', color: 'danger' },
      { label: '2', value: 2, tooltip: 'Insatisfecho', color: 'danger' },
      { label: '3', value: 3, tooltip: 'Neutro', color: 'warning' },
      { label: '4', value: 4, tooltip: 'Satisfecho', color: 'success' },
      { label: '5', value: 5, tooltip: 'Muy satisfecho', color: 'success' },
    ];
    const labels = { min: 'Muy insatisfecho', max: 'Muy satisfecho' };
    return <RangeSelector range={range}  change={change} labels={labels} name={`recomendar_${id}`} />;
  }

function Range_difficulty_survey({id,change}){
    const range = [
        { label: 'Muy dificil', value: "Muy dificil", tooltip: 'Muy dificíl', color: 'danger' },
        { label: 'Dificil', value: "Dificil", tooltip: 'Dificíl', color: 'danger' },
        { label: 'Ni fácil/ni difícil', value: "Ni fácil/ni difícil", tooltip: 'Neutro', color: 'warning' },
        { label: 'Facil', value: "Facil", tooltip: 'Satisfecho', color: 'success' },
        { label: 'Muy facil', value: "Muy facil", tooltip: 'Muy satisfecho', color: 'success' },
      ];
      const labels = { min: 'Muy insatisfecho', max: 'Muy satisfecho' };
      return <RangeSelector range={range}  change={change} labels={"Na"} name={`recomendar_${id}`} />;
}  

function Yes_no_survey({id,change}){

    const range = [
        { label: 'No', value: 0, tooltip: 'Insatisfecho', color: 'danger' },
        { label: 'Sí', value: 1, tooltip: 'Insatisfecho', color: 'success' },
      ];
      return <RangeSelector range={range}  change={change} labels={"Na"} name={`recomendar_${id}`} />;
}
function Range_emoji_survey({id,change}){
    const range = [
        { label: '🙁', value: 1, tooltip: 'muy triste', color: 'danger' },
        { label: '😐', value: 2, tooltip: 'triste', color: 'danger' },
        { label: '🙂', value: 3, tooltip: 'ok', color: 'secondary' },
        { label: '😄', value: 4, tooltip: 'Feliz', color: 'success' },
        { label: '😊', value: 5, tooltip: 'Muy feliz', color: 'success' },
      ];
      return <RangeSelector range={range}   change={change} labels={"Na"} name={`recomendar_${id}`} />;
}

function Single_choice_survey({id,answers,change}){
    return <SingleSelector answers={answers}   change={change} name={`option_${id}`}/>;
}

function Multiple_choice_survey({id,answers,change}){
  return <MultipleSelector answers={answers}  id={id} change={change} name={`option_${id}`}/>;
}


export  {Range_zerototen_survey,Range_onetofive_survey,Yes_no_survey,Range_difficulty_survey,Range_emoji_survey,Single_choice_survey,Multiple_choice_survey};