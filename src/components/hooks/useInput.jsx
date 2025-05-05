import { useState } from "react";

const useInput = ({ defaultValue, validate = null }) => {
  const [input, setInput] = useState(defaultValue);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    let value;

    if (e?.target?.files) {
      value = e.target.files[0]; 
    } else if (e?.target?.value !== undefined) {
      value = e.target.value; 
    } else {
      value = e; 
    }

    // Solo valida si es RegExp y el valor es texto
    if (validate instanceof RegExp && typeof value === "string") {
      if (!validate.test(value)) {
        setError("Campo invalido");
      } else {
        setError("");
      }
    }

    setInput(value);
    console.log(value,"valor");
  };

  return {
    input,
    handleChange,
    error,
  };
};

export default useInput;
