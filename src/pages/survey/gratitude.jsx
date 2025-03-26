import LogoEVA from "../../assets/img/logo EVA.webp";
import { useEffect } from "react";

export default function Gratitude() {
  useEffect(()=>
    console.log('Hola')
  ,[])
    // TODO: Implement gratitude page content here. For now, it's just a placeholder.
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
    <div className="cont-inactive container">
        <div className="text-center">
            <img src={LogoEVA} alt="" className="logoError" />
            <h1>Gracias </h1>
            <h3>por completar el cuestionario de la evaluación de calidad.</h3>
        </div>
    </div>
</div>
  )
}
