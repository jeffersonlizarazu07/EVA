import { useState,useContext,useEffect} from "react";
import "../../assets/css/tabla.css";
import { UserContext } from "../../context/UserContext";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
const TableAdmin = ({
  header,
  data,
  onCreate,
  onRemove,
  onUpdate,
  onView,
  onActive,
  modalId,
  modalId2
}) => {
  const { languageUser } = useContext(UserContext);
  useEffect(()=>{
    i18n.changeLanguage(languageUser)
  },[languageUser])
 
  const nav = useNavigate();
  const { t,i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(25);

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

  const filteredData = Array.isArray(data) ? data.filter((item) =>
    Object.values(item).some(
      (val) =>
        typeof val == "string" &&
        val.toLowerCase().includes(searchTerm.toLowerCase())
    )
  ) : [];
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredData.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);
  return (
    <div>
      <div className="table-container table-responsive" id="table">
        <div className="row d-flex mb-3">
          <div className="col-6 col-sm-6 col-md-6 col-lg-6">
            <button className="btn hola btn-block btn-sm btn-default btn-flat fw-bold acces-tabla m-1 mb-2" onClick={() => nav("/admin")} >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-90deg-left" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M1.146 4.854a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H12.5A2.5 2.5 0 0 1 15 6.5v8a.5.5 0 0 1-1 0v-8A1.5 1.5 0 0 0 12.5 5H2.707l3.147 3.146a.5.5 0 1 1-.708.708z"/>
              </svg>
            </button>
            <input className="w-50 inp-search" placeholder={t("userTable.Search")} value={searchTerm} onChange={handleSearch}/>
          </div>
          <div className="d-grid col-6 col-sm-6 col-md-6 col-lg-6 justify-content-end">
            <button className="btn hola btn-block btn-sm btn-default btn-flat fw-bold acces-tabla m-2"
              data-bs-toggle="modal" data-bs-target={`#${modalId}`} onClick={onCreate} >
              <i className="fa fa-plus"></i> {t("userTable.newUser")}
            </button>
          </div>
        </div>
        <table className="table table-hover" id="tableDefault">
          <thead>
            <tr className="table-light tr-table">
              {header.map((item, i) => (
                <th key={i} className="col text-center">
                  {item=="firstname"? (`${t("headerlt.First_name")}`):
                  (item=="lastname"? (`${t("headerlt.Last_name")}`):
                  (item=="type"?(`${t("headerlt.Role")}`):(`${t("viewUserModal.State")}`)))}
                </th>
              ))}
              <th className="col text-center">{t("userTable.Actions")}</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((item, idx) => (
             
                <tr key={idx}>
                  {header.map((key, i) => (
                    <td key={i}>
                      {key == "state" ? (item.state == 1 ? `${t("userTable.Active")}` : `${t("userTable.Inactive")}`):(
                        key =="type"? (item.type==1? `${t("userTable.SuperAdmin")}`:(item.type==2? `${t("userTable.Admin")}`:(item.type==3? `${t("userTable.Editor")}`:`${t("userTable.Viwer")}`))): item[key]) }
                    
                  </td>
                  ))}
                  {item.state==1?(
                    <td>
                    <div className="row">
                      <div className="col">
                        <button
                          className="btn btn-rect"
                          data-bs-toggle="modal"
                          data-bs-target={`#${modalId}`}
                          onClick={() => onUpdate(item)}
                        >
                          <i className="fa-solid fa-edit"></i>
                        </button>
                        <button
                          className="btn btn-rect"
                          onClick={() => onRemove(item)}
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
                  </td>):( <td>
                    <div className="row">
                      <div className="col">
                        <button
                          className="btn btn-rect"
                          onClick={() => onActive(item)}
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
                  </td>)}
                  
                </tr>
             
            ))}
          </tbody>
        </table>
        <div className="row d-flex ps-5 pe-5 mt-3">
        <div className="col-6 col-sm-6 col-md-6 col-lg-6">
          <label>
          {t("userTable.Show")}
            <button
              className="dropdown-toggle inp-search"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {recordsPerPage}
            </button>
            <ul className="dropdown-menu">
              {[25, 50, 75].map((num) => (
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
            {t("userTable.Registered")}
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
      
    </div>
  );
};

export default TableAdmin;