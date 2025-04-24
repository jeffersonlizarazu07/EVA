import { useState, useContext, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import { useTranslation } from "react-i18next";
import "../../assets/css/tabla.css";

const TableForms = ({
  header,
  data = [], // <- Aquí pones valor por defecto para evitar undefined
  onCreate,
  onRemove,
  onUpdate,
  onActive,
  onView,
  modalId,
  modalId2
}) =>{
  const { languageUser } = useContext(UserContext);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(languageUser);
  }, [languageUser]);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleRecordsPerPageChange = (records) => {
    setRecordsPerPage(records);
    setCurrentPage(1);
  };

  const capitalize = (text) => text.replace(/\b\w/g, (char) => char.toUpperCase());

  // Aquí se asegura que data sea arreglo
  const filteredData = (Array.isArray(data) ? data : []).filter((item) =>
    Object.values(item).some(
      (val) =>
        typeof val === "string" &&
        val.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);

  const totalPages = Math.ceil(filteredData.length / recordsPerPage);

  return (
    <div className="table-container">
      <div className="row d-flex mb-3">
        <div className="col-6">
          <input
            className="w-50 inp-search"
            placeholder={t("clientTable.Search")}
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="col-6 d-flex justify-content-end">
          <button
            className="btn hola btn-sm fw-bold acces-tabla m-2"
            data-bs-toggle="modal"
            data-bs-target={`#${modalId}`}
            onClick={onCreate}
          >
            <i className="fa fa-plus"></i> {t("clientTable.newClient")}
          </button>
        </div>
      </div>

      <table className="table table-hover">
        <thead>
          <tr className="table-light tr-table">
            {header.map((item, i) => (
              <th key={i} className="text-center">
                {capitalize(item)}
              </th>
            ))}
            <th className="text-center">{t("clientTable.Actions")}</th>

          </tr>
        </thead>
        <tbody>
          {currentRecords.map((form, idx) => (
            <tr key={idx}>
              {header.map((key, i) => (
                <td key={i}>
                  {key === "state"
                    ? form.state === 1
                      ? t("clientTable.Active")
                      : t("clientTable.Inactive")
                    : form[key]}
                </td>
              ))}
              <td>
                {form.state !== 1 ? (
                  <div className="dropdown">
                  <button className="btn-rect btn-dropdown" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <div className="dropdown-toggle">
                  <i className="fa-solid fa-ellipsis-vertical"></i>
                  </div>
                  </button>
                  <ul className="dropdown-menu p-0 ">
                    <li className="text-start btn-rect">
                    <button className="btn  btn-rect" onClick={()=> onCheck(item)}>
                  <i className="fa-solid fa-circle-question"></i> <span> Ver preguntas</span>
                  </button>
                    </li>
                    <li className="text-start  btn-rect"  >
                       <button  style={{width:"100%"}} className="btn text-start"  data-bs-toggle="modal"  data-bs-target={`#${modalId}`}   onClick={() => onUpdate(item)}
>
                <i className="fa-solid fa-edit"></i> Editar
              </button>
                    </li>
              <li className="text-start  btn-rect" > <button className="btn text-start"  style={{width:"100%"}} onClick={() => onRemove(item)}>
                <i className="fa-solid fa-power-off"></i> <span> Deshabilitar</span>
              </button></li>
                  </ul>
                </div>
                  
                ) : (
                  <div className="d-flex justify-content-center">
                    <button className="btn btn-rect" onClick={() => onActive(form)}>
                      <i className="fa-solid fa-power-off"></i>
                    </button>
                    <button
                      className="btn btn-rect"
                      data-bs-toggle="modal"
                      data-bs-target={`#${modalId2}`}
                      onClick={() => onView(form)}
                    >
                      <i className="fa-solid fa-search"></i>
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="row d-flex ps-5 pe-5 mt-3">
        <div className="col-6">
          <label>
            {t("clientTable.Show")}
            <button
              className="dropdown-toggle inp-search"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {recordsPerPage}
            </button>
            <ul className="dropdown-menu">
              {[10, 25, 50].map((num) => (
                <li key={num}>
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleRecordsPerPageChange(num);
                    }}
                  >
                    {num}
                  </a>
                </li>
              ))}
            </ul>
            {t("clientTable.Registered")}
          </label>
        </div>
        <div className="col-6 d-flex justify-content-end">
          <div className="btn-group">
            <button
              className="btn"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              &lt;
            </button>
            <label className="btn">{currentPage}</label>
            <button
              className="btn"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableForms;
