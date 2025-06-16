const ModalViewAdmin = ({
  formatDateTimeShort,
  registration_date,
  type,
  last_visit_date,
  selectedClients,
  firstName,
  middleName,
  lastName,
  state,
  language,
  email,
  listClients,
  t,
}) => {
  return (
    <div id="modalViewAdmin" className="modal fade" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-md">
        <div className="modal-content">
          <div
            className="modal-header mb-0 pb-0"
            style={{ borderBottom: "none" }}
          >
            <label className="h5">{t("viewUserModal.UserDetails")}</label>
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
              Información detallada del perfil de usuario.
            </p>
          </div>
          <div className="modal-body d-flex ">
            <div className="col  m-2 ">
              <div className="m-1 p-1">
                <label className="fw-semibold ">
                  {t("viewUserModal.Name")}
                </label>
                <input
                  type="text"
                  className="form-control mt-1"
                  value={`${firstName.input} ${middleName.input} ${lastName.input}`}
                  readOnly
                />
              </div>
              <div className="m-1 p-1">
                <span className="fw-semibold ">
                  {" "}
                  {t("viewUserModal.State")}
                </span>
                <p className="form-control mt-1">
                  {`${
                    state.input === 1
                      ? `${t("clientTable.Active")}`
                      : `${t("clientTable.Inactive")}`
                  }`}{" "}
                </p>
              </div>
              <div className="m-1 p-1">
                <span className="fw-semibold ">
                  {t("viewUserModal.RegisterDate")}
                </span>
                <p className="form-control mt-1">
                  {" "}
                  {formatDateTimeShort(registration_date.input)}
                </p>
              </div>
              <div className="m-1 p-1">
                <span className="fw-semibold ">
                  {t("viewUserModal.Language")}
                </span>
                <p className="form-control mt-1">
                  {" "}
                  {`${
                    language.input == "es"
                      ? `${t("headerlt.Spanish")}`
                      : language.input == "en"
                      ? `${t("headerlt.English")}`
                      : language.input == "it"
                      ? `${t("headerlt.Italian")}`
                      : `${t("headerlt.Portuguese")}`
                  }`}
                </p>
              </div>
            </div>
            <div className="col  m-2  ">
              <div className="m-1 p-1">
                <span className="fw-semibold ">{t("viewUserModal.Email")}</span>
                <input
                  type="text"
                  className="form-control mt-1"
                  value={email.input}
                  readOnly
                />
              </div>
              <div className="m-1 p-1">
                <span className="fw-semibold ">{t("viewUserModal.Role")}</span>
                <p type="text" className="form-control mt-1 role-option">
                  {" "}
                  {` ${
                    type.input === 1
                      ? "Super Administrador"
                      : type.input === 2
                      ? "Administrador"
                      : type.input == 3
                      ? "Editor"
                      : type.input == 4
                      ? "Agente"
                      : "cual rol"
                  }`}{" "}
                </p>
              </div>
              <div className="m-1 p-1">
                <span className="fw-semibold ">
                  {t("viewUserModal.LastVisit")}
                </span>
                <p className="form-control mt-1">
                  {formatDateTimeShort(last_visit_date.input)}{" "}
                </p>
              </div>
              <div className="m-1 p-1">
                <span className="fw-semibold ">
                  {t("viewUserModal.Clients")}
                </span>

                <ul className="form-control mt-1">
                  {selectedClients.length > 0 ? (
                    selectedClients.map((clientId) => {
                      const client = listClients.find((c) => c.id === clientId);
                      return client ? (
                        <li key={client.id}>{client.client}</li>
                      ) : null;
                    })
                  ) : (
                    <li>{t("viewUserModal.NotClients")}</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalViewAdmin;
