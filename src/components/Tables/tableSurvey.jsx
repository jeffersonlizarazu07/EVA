import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import axios from "axios";
import "../../assets/css/tabla.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const TableSurvey = ({
  header,
  data,
  onCreate,
  onRemove,
  onUpdate,
  onView,
  modalId,
  modalId2,
  onActive,
  onDuplicate,
  onCheck,
  onCopyLink,
  onBulkEmail,
}) => {

  const nav = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [userClients, setUserClients] = useState([]);
  const { userId, accessToken, languageUser } = useContext(UserContext);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(languageUser);
    getUserClients(userId);
    filteredData;
  }, [languageUser]);

  const getUserClients = async (id) => {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    };

    try {
      const response = await axios.get(
        `http://localhost:3000/api/users_client/${id}`,
        config
      );
      setUserClients(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset page to 1 on new search
  };

  const handleRecordsPerPageChange = (records) => {
    setRecordsPerPage(records);
    setCurrentPage(1); // Reset page to 1 on new records per page
  };

  const capitalize = (text) => {
    return text.replace(/\b\w/g, (char) => char.toUpperCase());
  };


  const filteredData = data.filter((item) =>
    //userClients.some(client => client.id  ==  item.idClient) &&
    Object.values(item).some(
      (val) =>
        typeof val  ==  "string" &&
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
        <div className="col-6 col-sm-6 col-md-6 col-lg-6">
          <button className="btn hola btn-block btn-sm btn-default btn-flat fw-bold acces-tabla m-1 mb-2" onClick={() => nav("/satisfaction")} >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-90deg-left" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M1.146 4.854a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H12.5A2.5 2.5 0 0 1 15 6.5v8a.5.5 0 0 1-1 0v-8A1.5 1.5 0 0 0 12.5 5H2.707l3.147 3.146a.5.5 0 1 1-.708.708z"/>
            </svg>
          </button>
          <input
            className="w-50 inp-search"
            placeholder="Buscar"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="d-grid col-6 col-sm-6 col-md-6 col-lg-6 justify-content-end">
          <button
            className="btn hola btn-block btn-sm btn-default btn-flat fw-bold acces-tabla m-2"
            data-bs-toggle="modal"
            data-bs-target={`#${modalId}`}
            onClick={() => onCreate()}
          >
            <i className="fa fa-plus"></i> Encuesta
          </button>
        </div>
      </div>
      <table className="table table-hover" id="tableDefault">
        <thead>
          <tr className="table-light tr-table">
            {header.map((item, i) => (
              <th key={i} className="col text-center">
                {capitalize(item)}
              </th>
            ))}
            <th className="col text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentRecords.map((item, idx) => (
            <tr key={idx}>
              {header.map((col, i) => (
                <td key={i}>
                  {col == "state"
                    ? item.state == 1
                      ? `${t("clientTable.Active")}`
                      : `${t("clientTable.Inactive")}`
                    : item[col.toLowerCase()] || item[col]}
                </td>
              ))}

              {item.state == 1 ? (
                <td>
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
                    <ul className="dropdown-menu p-0 ">
                      <li className="text-start btn-rect">
                        <button
                          className="btn  btn-rect"
                          onClick={() => onCheck(item)}
                        >
                          <i className="fa-solid fa-circle-question"></i>{" "}
                          <span> Ver preguntas</span>
                        </button>
                      </li>
                      <li className="text-start btn-rect">
                        <button
                          className="btn text-start"
                          style={{ width: "100%" }}
                          onClick={() => onCopyLink(item)}
                        >
                          <i className="fa-solid fa-link"></i>{" "}
                          <span> Copiar enlace</span>
                        </button>
                      </li>
                      <li className="text-start  btn-rect">
                        <button
                          style={{ width: "100%" }}
                          className="btn text-start"
                          data-bs-toggle="modal"
                          data-bs-target={`#${modalId}`}
                          onClick={() => onUpdate(item)}
                        >
                          <i className="fa-solid fa-edit"></i> Editar
                        </button>
                      </li>

                      <li className="text-start  btn-rect">
                        <button
                          className="btn text-start"
                          onClick={() => onBulkEmail(item)}
                          style={{ width: "100%" }}
                        >
                          <i className="fa-solid fa-envelopes-bulk"></i>
                          <span> Envio masivo</span>
                        </button>
                      </li>
                      <li className="text-start btn-rect">
                        <button
                          className="btn text-start "
                          onClick={() => onDuplicate(item)}
                          style={{ width: "100%" }}
                        >
                          <i className="fa-solid fa-clone"></i>{" "}
                          <span>Duplicar</span>
                        </button>
                      </li>
                      <li className="text-start  btn-rect">
                        {" "}
                        <button
                          className="btn text-start"
                          style={{ width: "100%" }}
                          onClick={() => onRemove(item)}
                        >
                          <i className="fa-solid fa-power-off"></i>{" "}
                          <span> Deshabilitar</span>
                        </button>
                      </li>
                    </ul>
                  </div>
                </td>
              ) : (
                <td>
                  <div className="row">
                    <div className="col">
                      <button
                        className="btn btn-rect"
                        onClick={() => onActive(item)}
                        data-bs-toggle="tooltip"
                        data-bs-placement="bottom"
                        data-bs-title="Tooltip on bottom"
                      >
                        <i className="fa-solid fa-power-off"></i>
                      </button>
                      <button
                        className="btn btn-rect"
                        data-bs-toggle="modal"
                        data-bs-target={`#${modalId2}`}
                        onClick={() => onView(item)}
                      >
                        <i className="fa-solid fa-search"></i>
                      </button>
                    </div>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="row d-flex ps-5 pe-5 mt-3">
        <div className="col-6 col-sm-6 col-md-6 col-lg-6">
          <label>
            Mostrar
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
                    onClick={() => handleRecordsPerPageChange(num)}
                  >
                    {num}
                  </a>
                </li>
              ))}
            </ul>
            registros
          </label>
        </div>
        <div className="d-grid col-6 col-sm-6 col-md-6 col-lg-6 justify-content-end">
          <div
            className="btn-group"
            role="group"
            aria-label="Basic outlined example"
          >
            <button
              type="button"
              className="btn"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              &lt;
            </button>
            <label className="btn" htmlFor="btncheck2">
              {currentPage}
            </label>
            <button
              type="button"
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
export default TableSurvey;
