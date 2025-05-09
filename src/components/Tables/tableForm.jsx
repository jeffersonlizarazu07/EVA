import { useState, useContext, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "../../assets/css/tabla.css";
import SurveyBlocks from "../../pages/quality/surveyBlocks";

const TableForms = ({
  header,
  data = [], // <- Aquí pones valor por defecto para evitar undefined
  onCreate,
  onRemove,
  onUpdate,
  onActive,
  onView,
  modalId,
  modalId2,
}) => {
  const nav = useNavigate();
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

  const capitalize = (text) =>
    text.replace(/\b\w/g, (char) => char.toUpperCase());

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
  const currentRecords = filteredData.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const totalPages = Math.ceil(filteredData.length / recordsPerPage);

  return (
    <div className="table-container">
      <div className="row d-flex mb-3">
        <div className="col-6">
          <button
            className="btn hola btn-block btn-sm btn-default btn-flat fw-bold acces-tabla m-1 mb-2"
            onClick={() => nav("/quality")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-arrow-90deg-left"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M1.146 4.854a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H12.5A2.5 2.5 0 0 1 15 6.5v8a.5.5 0 0 1-1 0v-8A1.5 1.5 0 0 0 12.5 5H2.707l3.147 3.146a.5.5 0 1 1-.708.708z"
              />
            </svg>
          </button>
          <input
            className="w-50 inp-search"
            placeholder={t("formTable.Search")}
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
            <i className="fa fa-plus"></i> {t("formTable.newForm")}
          </button>
        </div>
      </div>

      <table className="table table-hover">
        <thead>
          <tr className="table-light tr-table">
            {header.map((item, i) => (
              <th key={i} className="text-center">
                {t(`formTable.${item}`)}
              </th>
            ))}
            <th className="text-center">{t("formTable.Actions")}</th>
          </tr>
        </thead>
        <tbody>
          {currentRecords.map((form, idx) => (
            <tr key={idx}>
              {header.map((key, i) => (
                <td key={i}>
                  {key === "state"
                    ? form.state === "Activo"
                      ? t("formTable.Active")
                      : t("formTable.Inactive")
                    : form[key]}
                </td>
              ))}
              <td>
                {form.state === "Activo" ? (
                  <div className="dropdown">
                    <button
                      className="btn-rect btn-dropdown"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <div className="dropdown-toggle">
                        <i className="fa-solid fa-ellipsis-vertical"></i>
                      </div>
                    </button>
                    <ul className="dropdown-menu p-0">
                      <li className="text-start btn-rect">
                        <button
                          className="btn btn-rect"
                          onClick={() => onView(form)}
                        >
                          <i className="fa-solid fa-circle-question"></i>{" "}
                          <span>{t("buttons.WatchSections")}</span>
                        </button>
                      </li>
                      <li className="text-start btn-rect">
                        <button
                          className="btn text-start w-100"
                          data-bs-toggle="modal"
                          data-bs-target={`#${modalId}`}
                          onClick={() => onUpdate(form)}
                        >
                          <i className="fa-solid fa-edit"></i>{" "}
                          {t("buttons.Edit")}
                        </button>
                      </li>
                      <li className="text-start btn-rect">
                        <button
                          className="btn text-start w-100"
                          onClick={() => onRemove(form)} // Deshabilitar
                        >
                          <i className="fa-solid fa-power-off"></i> {""}
                          <span>{t("buttons.Deactivate")}</span>
                        </button>
                      </li>
                    </ul>
                  </div>
                ) : (
                  <div className="d-flex justify-content-center">
                    <button
                      className="btn btn-rect d-flex flex-column align-items-center"
                      onClick={() => onActive(form)} // Habilitar
                    >
                      <i class="bi bi-check-circle-fill fs-5"></i>
                      <span>{t("buttons.Activate")}</span>
                    </button>
                    {/* <button
                      className="btn btn-rect"
                      data-bs-toggle="modal"
                      data-bs-target={`#${modalId2}`}
                      onClick={() => onView(form)}
                    >
                      <i className="fa-solid fa-search"></i>
                    </button> */}
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
            {t("formTable.Show")}
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
            {t("formTable.Registered")}
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
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
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
