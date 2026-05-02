import "../../assets/css/errorViews.css";
import LogoEVA from "../../assets/img/logo EVA.webp";
import { useNavigate } from "react-router-dom";
export default function Inactive() {
    const nav = useNavigate();
    const back=()=>{
        nav('/')
    }
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
    <div className="cont-inactive container">
        <div className="text-center">
            <img src={LogoEVA} alt="" className="logoError" />
            <h1 className='text-center'>Usuario inactivo</h1>
            <p className='text-center fs-4'>Contáctese con el administrador del sitio.</p>
            <button className="btn btn-primary text-center mt-2" onClick={()=> back()}> Volver al inicio</button>
        </div>
    </div>
</div>
  )
}
