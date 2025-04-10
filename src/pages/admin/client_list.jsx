import axios from "axios";
import Swal from "sweetalert2";
import { useState, useEffect, useContext } from "react";
import HeaderLT1 from "../../components/header/headerLT1";
import SidebarLT1 from "../../components/aside/sidebarLT1";
import TableDetalle from "../../components/Tables/tableClients";
import useInput from "../../components/hooks/useInput";
import { UserContext } from "../../context/UserContext";
import "../../assets/css/newUser.css";
import { Toast, smallAlertDelete } from "../../assets/js/alertConfig";
import { useTranslation } from "react-i18next";
import { SketchPicker } from "react-color";
import { useStateManager } from "react-select";

export default function Client_list() {
  const [operation, setOperation] = useState([1]);
  const [idToEdit, setidToEdit] = useState(null);
  const [logoEdit, setLogoToEdit] = useState("");
  const [title, setTitle] = useState();
  const selectedKeys = ["id", "client", "state"];
  const [data, setData] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [displayColorPicker2, setDisplayColorPicker2] = useState(false);
  const [error,setError]=useState('')
  const [colors1, setColors1] = useState("#FFFFFF");
  const [colors2, setColors2] = useState("#FFFFFF");
  const [previewUrl,setPreviewUrl]=useState(null)
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showColorPicker2, setShowColorPicker2] = useState(false);
  const url = "http://localhost:3000/api/clients";
  const { t, i18n } = useTranslation();

  const client = useInput({ defaultValue: "", validate: /^[A-Za-z ]*$/ });
  const logo = useInput({ defaultValue: "", validate: "" });
  const estado = useInput({ defaultValue: "", validate: /^[0-1]+$/ });

  const { accessToken, languageUser } = useContext(UserContext);
  useEffect(() => {
    fetchData();
    i18n.changeLanguage(languageUser);
  }, [languageUser]); // Arreglo dependiente de que se tenga languageUser para carga de idioma

  const config = {
    withCredentials: true,
    'Content-Type': 'multipart/form-data',
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(url, config);
      console.log(response.data.data);
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const openModalCont = (clientData) => {
    client.handleChange(clientData?.client || "");
    estado.handleChange(clientData?.state || "");
    logo.handleChange(clientData?.logo || "");
    setColors1(clientData?.color_tag1|| "");
    setColors2(clientData?.color_tag2|| "");
  };


  const activation = (clientData) => {
    const url = `http://localhost:3000/api/clients`;
    const id = clientData.id;
    const name = clientData.client;
    console.log(name);
    const parametros = {
      state: 1,
    };
    smallAlertDelete
      .fire({
        text: `${t("alertActivate.TheClient")} ${name} ${t(
          "alertActivate.FinalPhrase"
        )}`,
        showCancelButton: true,
        confirmButtonText: `${t("alertActivate.Confirm")}`,
        cancelButtonText: `${t("alertActivate.Cancel")}`,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            await axios.patch(`${url}/${id}`, parametros, config);

            Toast.fire({
              icon: "success",
              title: `${t("alertActivate.TheClient")} ${clientData.client} ${t(
                "alertActivate.SuccessAlert"
              )}`,
            });
          } catch (error) {
            Toast.fire({
              icon: "error",
              title: `${t("alertActivate.TheClient")} ${clientData.client}${t(
                "alertActivate.ErrorAlert"
              )} `,
            });
            console.error(error);
          }
        }
        fetchData();
      });
  };
  const deactivation = (clientData) => {
    const url = `http://localhost:3000/api/clients`;
    const id = clientData.id;
    const name = clientData.client;
    const parametros = {
      state: 0,
    };
    smallAlertDelete
      .fire({
        text: `${t("alertActivate.TheClient")} ${name} ${t(
          "alertDeactivate.FinalPhrase"
        )}`,
        showCancelButton: true,
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar",
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            await axios.patch(`${url}/${id}`, parametros, config);
            Toast.fire({
              icon: "success",
              title: `${t("alertActivate.TheClient")} ${clientData.client} ${t(
                "alertActivate.SuccessAlert"
              )}`,
            });
            fetchData();
          } catch (error) {
            Toast.fire({
              icon: "error",
              title: `${t("alertActivate.TheClient")} ${clientData.client} ${t(
                "alertActivate.ErrorAlert"
              )}`,
            });
            console.error(error);
          }
        }
        fetchData();
      });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    // Verificar que el archivo seleccionado sea JPEG o PNG
    if (
      selectedFile &&
      (selectedFile.type === "image/jpeg" || selectedFile.type === "image/png")
    ) {
      setSelectedFile(selectedFile);
      if (selectedFile){
          console.log("Si se subio un archivo")
      }

      operation ===2 ? document.getElementById("logoToEditOriginal").style.display="none":null
      const reader = new FileReader()
      reader.onloadend=()=>{
          setPreviewUrl(reader.result);
      }
      reader.readAsDataURL(selectedFile);
    } else {
      // Mostrar un mensaje de error o realizar alguna acción en caso de no ser un archivo JPEG o PNG
      console.log("Por favor selecciona un archivo JPEG o PNG.");
    }
  };

  const handleColor1Change = (color) => {
    setColors1(color.hex);
    console.log(colors1);
  };

  const handleColor2Change = (color) => {
    setColors2(color.hex);
    console.log(colors2);
  };

  const openModal = (op, clientData) => {
    setOperation(op);
    setError('')
    if (op == 1) {
      setSelectedFile(null);
      setPreviewUrl(null)
      setColors1("#FFFFFF");
      setColors2("#FFFFFF");
      setTitle(t("clientModal.NewClient"));
      client.handleChange("");
      logo.handleChange("");
      setLogoToEdit("");
    } else if (op == 2) {
      setTitle(t("clientModal.EditClient"));
      client.handleChange(clientData?.client || "");
      setLogoToEdit(clientData?.logo || "");
      setidToEdit(clientData?.id);
      setColors1(clientData?.color_tag1|| "")
      setColors2(clientData?.color_tag2|| "")
      console.log(idToEdit)
    }
  };

  const validar = async (id) => {
    const urlpost = `http://localhost:3000/api/clients`;
    const formData = new FormData();
    console.log("Archivo seleccionado:", selectedFile);
    console.log("Cliente:", client.input);
    console.log("Color 1:", colors1);
    console.log("Color 2:", colors2);
    selectedFile ? formData.append("logo", selectedFile) : null;
    formData.append("client", client.input);
    formData.append("color_tag1", colors1);
    formData.append("color_tag2", colors2);
    formData.append("state", 1);

    if (id == null) {
        // Aquí se crea un nuevo cliente
        try {
            const clientExists = data.some(item => item.client === client.input);
            if (clientExists) {
                setError("El nombre del cliente ya existe");
                return;
            }
            const response = await axios.post(`${urlpost}`, formData, {
                withCredentials: true,  
            });
            console.log("Respuesta del servidor:", response.data);
            if (response.data.status) {
                setColors1("#FFFFFF");
                setColors2("#FFFFFF");
                setSelectedFile(null);
                setError('');
                fetchData();
                document.getElementById("btnCerrar").click();
                Toast.fire({
                    icon: "success",
                    title: `${t("alertActivate.TheClient")} ${client.input} ${t("alertActivate.Created")}`
                });
            }
        } catch (error) {
            console.error("Error subiendo el archivo:", error);
        }
    } else {
        // Aquí se realiza una actualización del cliente con PUT
        const urlput = `http://localhost:3000/api/clients/${id}`;
        
        try {
            const response = await axios.put(urlput, formData, {
                    'Content-Type': 'multipart/form-data', 
                    withCredentials: true
            });
            console.log("Respuesta del servidor:", response);
            if (!response.data.status) {
                alert("No se realizó la edición del cliente");
                document.getElementById("btnCerrar").click();
                console.log(response.data);
            }
            Toast.fire({
                icon: "success",
                title: `El cliente ${client.input} se ha editado exitosamente`,
            });
            fetchData();
            document.getElementById("btnCerrar").click();
        } catch (error) {
            console.error("Error actualizando el cliente:", error);
        }
    }
};

 
  const handleClose = () => {
    setDisplayColorPicker(false);
  };
  const handle2Close = () => {
    setDisplayColorPicker2(false);
  };
  const handleClick = () => {
    setDisplayColorPicker(!displayColorPicker);
  };
  const handle2Click = () => {
    setDisplayColorPicker2(!displayColorPicker);
  };

  const triggerFileInput=()=>{
    document.getElementById("imagenLogo").click();
  }

  const styles = {
    color: {
      width: "36px",
      height: "24px",
      borderRadius: "8px",
      background: `${colors1}`,
      border: "1px solid  gray",
    },
    
    swatch: {
      background: "#fff",
      borderRadius: "1px",
      cursor: "pointer",
    },
    popover: {
      position: "absolute",
      zIndex: "2",
    },
    cover: {
      position: "fixed",
      top: "0px",
      right: "0px",
      bottom: "0px",
      left: "0px",
    },
  };
  const styles2 = {
    color: {
      width: "36px",
      height: "24px",
      borderRadius: "8px",
      background: `${colors2}`,
      border: "1px solid gray",
    },
    swatch: {
      background: "#fff",
      borderRadius: "1px",

      cursor: "pointer",
    },
    popover: {
      position: "absolute",
      zIndex: "2",
    },
    cover: {
      position: "fixed",
      top: "0px",
      right: "0px",
      bottom: "0px",
      left: "0px",
    },
  };
  return (
    <div className="App">
      <div id="body">
        <HeaderLT1 />
        <section
          style={{ alignItems: "stretch", flexWrap: "nowrap", padding: 0 }}
        >
          {/* <SidebarLT1 /> */}
          <div className="container mt-0">
            {data.length > 0 && (
              <TableDetalle
                header={selectedKeys}
                data={data}
                onCreate={() => openModal(1)}
                onRemove={(item) => deactivation(item)}
                modalId={"modalCreateClient"}
                modalId2={"modalViewClient"}
                onUpdate={(payload) => openModal(2, payload)}
                onView={(payload) => openModalCont(payload)}
                onActive={(payload) => activation(payload)}
              />
            )}
          </div>
        </section>
      </div>

      <div id="modalViewClient" className="modal fade" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div
              className="modal-header mb-0 pb-0 text-center"
              style={{ borderBottom: "none" }}
            >
              <label className="fw-bold fs-5">
                {t("clientViewModal.Client")}
              </label>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="close"
              ></button>
            </div>
            <div>
              {" "}
              <p
                style={{
                  marginLeft: "15px",
                  marginBottom: 0,
                  padding: 0,
                  color: "gray",
                  fontSize: "small",
                }}
              >
                {t("clientViewModal.ClientInfo")}
              </p>
            </div>

            <div className="modal-body">
              <div className="row text-center"></div>
              <div className="row">
                <div className="col m-2">
                  <div className="col m-2 text-center">
                    <img
                      src={`clientes/${logo.input}`}  
                      alt="Logo"
                      className="logoModal"
                      width={100} height={100} 
                    />
                  </div>
                </div>
                <div className="col  m-2 ">
                  <div className="m-1 p-1 text-center">
                    <p className="fw-semibold fs-5">{client.input}</p>
                    <p className="text-secondary">
                      {" "}
                      <span>{`${
                        estado.input == 1
                          ? `${t("clientTable.Active")}`
                          : `${t("clientTable.Inactive")}`
                      }`}</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-12">
                <div className="row d-flex justify-content-between">
                <div className="col-6 m-2">
                  <p>{t("clientTable.selectedColor")}:</p>
                </div>
                <div className="col-5">
                  <div className="row">
                <div className="col-3 m-2">
                      <div style={styles.swatch} onClick={handleClick}>
                      <div style={styles.color}/>
                    </div>
                    {displayColorPicker && (
                      <div style={styles.popover}>
                        <div style={styles.cover} onClick={handleClose} />
                        <div className="cuadro" style={{background:colors1}}>
                        </div>
                      </div>
                    )}
                      </div>
                      <div className="col-1 m-2">
                      <div style={styles2.swatch} onClick={handle2Click}>
                      <div style={styles2.color} />
                        </div>
                      {displayColorPicker2 && (
                      <div style={styles2.popover}>
                        <div style={styles2.cover} onClick={handle2Close} />
                        <div className="cuadro" style={{background:colors2}}>
                        </div>
                      </div>
                    )}
                      </div>
                      </div>
                </div>
                      
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </div>

      {
        <div id="modalCreateClient" className="modal fade" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div
                className="modal-header mb-0 pb-0 text-center"
                style={{ borderBottom: "none" }}
              >
                <label className="fw-bold fs-5">{title}</label>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="close"
                ></button>
              </div>

              <div className="modal-body">
                <div className="row text-center"></div>
                <div className="row">
                 <div className="col-5 m-2 ms-5 text-center ">
                    {logoEdit && operation===2? (
                    <img src={`clientes/${logoEdit}`} alt="Logo"  width={150} height={150} id="logoToEditOriginal" className="logoModal m-2"/>
                    ):null}
                    {selectedFile? (<img src={previewUrl} alt="Logo"  width={150} height={150}  className="logoModal m-2"/>):null}
                  </div>      
                     <div className="col-5 ms-2 mt-5 ">
                      <div className="mt-4"></div>
                     <button type="button" className="btn btn-primary" onClick={triggerFileInput}>
                   <i className="fa-solid fa-arrow-up-from-bracket"></i>
                  </button>
                  <input
                    type="file"
                    id="imagenLogo"
                    accept=".jpg, .jpeg, .png"
                    onChange={handleFileChange}
                    style={{ display: "none" }} // Ocultar el input
                  />
                 <span className="ms-1 text-center" >{operation===2? "Modificar logo":"Añadir un logo "}</span>
                  </div>
                  <div className="col m-2 ">
                    <label id="labelAnimation" className="text-center">
                      <input
                        type="text"
                        placeholder=" "
                        className="input-new"
                        name="client"
                        value={client.input}
                        onChange={(e) => client.handleChange(e.target.value)}
                      />
                      <span className="labelName">
                        {t("clientModal.ClientName")}
                      </span>
                    </label>
                  </div>
                  <div className="row">
                  
                  </div>
                </div>
                <div className="row d-flex justify-content-between">
                  <small className="mt-4 ms-3">
                    <span>
                      Selecciona dos colores representativos del cliente:
                    </span>
                  </small>
                  <div className="col-5 text-center d-flex justify-content-center m-2">
                    <span className="me-2">Color principal:</span>
                    <div style={styles.swatch} onClick={handleClick}>
                      <div style={styles.color} />
                    </div>
                    {displayColorPicker && (
                      <div style={styles.popover}>
                        <div style={styles.cover} onClick={handleClose} />
                        <SketchPicker
                          color={colors1}
                          onChange={handleColor1Change}
                        />
                      </div>
                    )}
                  </div>
                  <div className="col-6 text-center d-flex justify-content-center m-2">
                    <span className="me-2">Color secundario: </span>
                    <div style={styles2.swatch} onClick={handle2Click}>
                      <div style={styles2.color} />
                    </div>
                    {displayColorPicker2 && (
                      <div style={styles2.popover}>
                        <div style={styles2.cover} onClick={handle2Close} />
                        <SketchPicker
                          color={colors2}
                          onChange={handleColor2Change}
                        />
                      </div>
                    )}
                  </div>
                </div>
                {error && <p className='text-danger text-center'>{error}</p>}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  id="btnCerrar"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  {t("sidebarlt.Cancel")}
                </button>
                <button
                  onClick={() => validar(idToEdit)}
                  className="btn-primary btn"
                >
                  {t("sidebarlt.Save")}
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  );
}
