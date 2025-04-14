import "../../assets/css/questions.css";


function Range_onetofive() {
  return (
    <div className="input-group justify-content-center mt-4 mb-4">
    <div className="me-2">
      <p className="ms-2 mt-2 fw-bold fs-6 redIncorrect">Muy insatisfecho</p>
    </div>
    <div className="btn-group " role="group" aria-label="Basic radio toggle button group">
      <a data-bs-toggle="tooltip" data-bs-title="Muy insatisfecho" className=' m-1'>
        <input type="radio" className="btn-check" name="probability" id="satisfaccion1" autoComplete="off" value="1"/>
        <label className="btn btn-outline-danger" htmlFor="satisfaccion1">1</label>
      </a>
      <a data-bs-toggle="tooltip" data-bs-title="Insatisfecho" className=' m-1'>
        <input type="radio" className="btn-check  m-2" name="probability" id="satisfaccion2" autoComplete="off" value="2"/>
        <label className="btn btn-outline-danger" htmlFor="satisfaccion2">2</label>
      </a>
      <a data-bs-toggle="tooltip" data-bs-title="Ni satisfecho/ni insatisfecho" className=' m-1'>
        <input type="radio" className="btn-check m-2" name="probability" id="satisfaccion3" autoComplete="off" value="3"/>
        <label className="btn btn-outline-primary" htmlFor="satisfaccion3">3</label>
      </a>
      <a data-bs-toggle="tooltip" data-bs-title="Satisfecho" className=' m-1'>
        <input type="radio" className="btn-check" name="probability" id="satisfaccion4" autoComplete="off" value="4"/>
        <label className="btn btn-outline-success" htmlFor="satisfaccion4">4</label>
      </a>
      <a data-bs-toggle="tooltip" data-bs-title="Muy satisfecho" className=' m-1'>
        <input type="radio" className="btn-check" name="probability" id="satisfaccion5" autoComplete="off" value="5"/>
        <label className="btn btn-outline-success" htmlFor="satisfaccion5">5</label>
      </a>
    </div>
    <div className="ms-2">
      <p className="ms-2 fw-bold fs-6 mt-2 greenCorrect">Muy satisfecho</p>
    </div>
  </div>
  )
}

function Range_zerototen (){
  
  return (
  <div className="input-group justify-content-center mt-4 mb-4">
  <div className="me-2">
    <p className="ms-2 fw-bold fs-6 mt-2  redIncorrect" >Nada probable</p>
  </div>
  <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
    <a data-bs-toggle="tooltip" data-bs-title="Nada probable" className=' m-1'>
      <input type="radio" className="btn-check" name="probability" id="recomendar1" autoComplete="off" value="0"/>
      <label className="btn btn-outline-danger" htmlFor="recomendar1">0</label>
    </a>

    <a data-bs-toggle="tooltip" data-bs-title="Nada probable" className=' m-1'>
      <input type="radio" className="btn-check" name="probability" id="recomendar2" autoComplete="off" value="1"/>
      <label className="btn btn-outline-danger" htmlFor="recomendar2">1</label>
    </a>

    <a data-bs-toggle="tooltip" data-bs-title="Nada probable" className=' m-1'>
      <input type="radio" className="btn-check" name="probability" id="recomendar3" autoComplete="off" value="2"/>
      <label className="btn btn-outline-danger" htmlFor="recomendar3">2</label>
    </a>

    <a data-bs-toggle="tooltip" data-bs-title="Nada probable" className=' m-1'>
      <input type="radio" className="btn-check" name="probability" id="recomendar4" autoComplete="off" value="3"/>
      <label className="btn btn-outline-danger" htmlFor="recomendar4">3</label>
    </a>

    <a data-bs-toggle="tooltip" data-bs-title="Nada probable" className=' m-1'>
      <input type="radio" className="btn-check" name="probability" id="recomendar5" autoComplete="off" value="4"/>
      <label className="btn btn-outline-danger" htmlFor="recomendar5">4</label>
    </a>

    <a data-bs-toggle="tooltip" data-bs-title="Nada probable" className=' m-1'>
      <input type="radio" className="btn-check" name="probability" id="recomendar6" autoComplete="off" value="5"/>
      <label className="btn btn-outline-danger" htmlFor="recomendar6">5</label>
    </a>

    <a data-bs-toggle="tooltip" data-bs-title="Nada probable" className=' m-1'>
      <input type="radio" className="btn-check" name="probability" id="recomendar7" autoComplete="off" value="6"/>
      <label className="btn btn-outline-danger" htmlFor="recomendar7">6</label>
    </a>

    <a data-bs-toggle="tooltip" data-bs-title="Neutro" className=' m-1'>
      <input type="radio" className="btn-check" name="probability" id="recomendar8" autoComplete="off" value="7"/>
      <label className="btn btn-outline-primary" htmlFor="recomendar8">7</label>
    </a>

    <a data-bs-toggle="tooltip" data-bs-title="Neutro" className=' m-1'>
      <input type="radio" className="btn-check" name="probability" id="recomendar9" autoComplete="off" value="8"/>
      <label className="btn btn-outline-primary" htmlFor="recomendar9">8</label>
    </a>

    <a data-bs-toggle="tooltip" data-bs-title="Muy probable" className=' m-1'>
      <input type="radio" className="btn-check" name="probability" id="recomendar10" autoComplete="off" value="9"/>
      <label className="btn btn-outline-success" htmlFor="recomendar10">9</label>
    </a>

    <a data-bs-toggle="tooltip" data-bs-title="Muy probable" className=' m-1'>
      <input type="radio" className="btn-check" name="probability" id="recomendar11" autoComplete="off" value="10"/>
      <label className="btn btn-outline-success" htmlFor="recomendar11">10</label>
    </a>
  </div>
  <div className="me-2">
    <p className="ms-2 fw-bold fs-6 mt-2 greenCorrect">Muy probable</p>
  </div>
</div>)
}

function Range_difficulty(){
  return(
    <div className="input-group justify-content-center mt-4 mb-4">
      <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
        <input type="radio" className="btn-check" name="dificult" id="dificultad1" autoComplete="off" value="Muy dificil"/>
        <label className="btn btn-outline-danger" htmlFor="dificultad1">Muy difícil</label>

        <input type="radio" className="btn-check" name="dificult" id="dificultad2" autoComplete="off" value="Dificil"/>
        <label className="btn btn-outline-danger" htmlFor="dificultad2">Difícil</label>

        <input type="radio" className="btn-check" name="dificult" id="dificultad3" autoComplete="off" value="Neutro"/>
        <label className="btn btn-outline-primary" htmlFor="dificultad3">Ni fácil/ni difícil</label>

        <input type="radio" className="btn-check" name="dificult" id="dificultad4" autoComplete="off" value="Facil"/>
        <label className="btn btn-outline-success" htmlFor="dificultad4">Fácil</label>

        <input type="radio" className="btn-check" name="dificult" id="dificultad5" autoComplete="off" value="Muy facil"/>
        <label className="btn btn-outline-success" htmlFor="dificultad5">Muy fácil</label>
      </div>
    </div>
     )
}
function Yes_no(){
  return(
    <div className="input-group justify-content-center mt-4 mb-4">
    <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
    <a data-bs-toggle="tooltip" data-bs-title="Muy probable" className=' m-1'>
    <input type="radio" className="btn-check" name="yes_no" id="si_no1" autoComplete="off" value="NO" />
    <label className="btn btn-outline-danger" htmlFor="si_no1">NO</label>
    </a>
    <a data-bs-toggle="tooltip" data-bs-title="Muy probable" className=' m-1'>
    <input type="radio" className="btn-check" name="yes_no" id="si_no2" autoComplete="off" value="SI"/>
    <label className="btn btn-outline-success" htmlFor="si_no2">SI</label>
    </a>
    </div>
    </div>
  )
}

function Range_emoji(){
  return(
  <div className="input-group justify-content-center mt-4 mb-4">
    <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
    <input type="radio"   className="btn-check" autoComplete="off" value="bad"  id='notBad' name="emojis"/>
      <label className="btn btn-outline-danger fs-5" htmlFor="notBad">🙁</label>
      <input type="radio"   className="btn-check" autoComplete="off" value="bad"  id='bad' name="emojis"/>
      <label className="btn btn-outline-danger fs-5" htmlFor="bad">😐</label>
      <input type="radio"   className="btn-check" autoComplete="off" value="ok"  id='ok' name="emojis"/>
      <label className="btn btn-outline-primary  fs-5" htmlFor="ok">🙂</label>
      <input type="radio"   className="btn-check" autoComplete="off" value="good"  id='good' name="emojis"/>
      <label className="btn btn-outline-success fs-5" htmlFor="good">😄</label>
      <input type="radio"   className="btn-check btn-light" autoComplete="off" value="awesome"  id='awesome' name="emojis"/>
      <label className="btn btn-outline-success fs-5" htmlFor="awesome">😊</label>
      </div>
  </div>)
}

function Textfield_s(){
  return(
  <div className="form-group">
    <textarea name="" id="" cols="30" rows="3" className="form-control" placeholder="Escriba su respuesta aquí..."></textarea>
  </div>)
}

function SingleChoiceView({options,correctOption}){
  const optionsArray= options.split(",")
  const correctOptionToInt=parseInt(correctOption) 
  
  return(
    <div className="mt-4 mb-4">
    {optionsArray.map((option, index) => {
      return (
        <div key={index} className="row mb-3 ">
        <div className="col">
          <div className="form-check">
            <input type="radio" className="form-check-input" autoComplete="off" readOnly value={option} id={`option-${index}`}  checked={correctOptionToInt === index} 
 />
            <label className="form-check-label" htmlFor={`option-${index}`}>{option}</label>
          </div>
        </div>
      </div>
      
      );
    })}
  </div>
  )
}
function MultipleChoiceView({options, correctOption}){
  const optionsArray= options.split(",")
  const correctOptions = correctOption.split(",").map(option => parseInt(option, 10));
  return(
    <div className="mt-4 mb-4">
    {optionsArray.map((option, index) => {
      return (
        <div key={index} className="row mb-3">
        <div className="col">
          <div className="form-check">
            <input type="radio" className="form-check-input" autoComplete="off" readOnly value={option} id={`optionMultiple-${index}`}  checked={correctOptions.includes(index)} 
             />
            <label className="form-check-label" htmlFor={`optionMultiple-${index}`}>{option}</label>
          </div>
        </div>
      </div>
      
      );
    })}
  </div>
  )
}

export  {Range_onetofive, Range_zerototen, Range_difficulty,Yes_no,Range_emoji,Textfield_s,SingleChoiceView,MultipleChoiceView}