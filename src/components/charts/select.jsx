import React, { useEffect, useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import axios from "axios";

const SelectMulti = () => {
  const [clients, setClients] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedClients, setSelectedClients] = useState([]);

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  const config = {
     withCredentials: true,
  };

  useEffect(() => {
    getClients();
    getUsers();
  }, []);

  const getClients = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/clients`,
        config
      );
      setClients(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getUsers = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/users`,
        config
      );
      setUsers(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getUserClients = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/users_client/${id}`,
        config
      );
      const responseData = response.data.data;
      console.log(responseData);
      setSelectedClients(responseData.map((client) => client.idClient));
      console.log({ selectedClients });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const onChange = (event, value) => {
    const selectedClientIds = value.map((client) => client.id);
    setSelectedClients(selectedClientIds);
  };

  const handleUserChange = (event) => {
    const userId = event.target.value;
    if (userId) {
      getUserClients(userId);
    } else {
      setSelectedClients([]);
    }
  };

  return (
    <div className="App">
      <div className="row m-5">
        <div className="col">
          <Autocomplete
            multiple
            limitTags={2}
            id="checkboxes-tags-demo"
            options={clients}
            disableCloseOnSelect
            onChange={onChange}
            getOptionLabel={(option) => option.client}
            value={clients.filter((client) =>
              selectedClients.includes(client.id)
            )}
            renderOption={(props, option, { selected }) => (
              <li key={option.id} {...props}>
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {option.client}
              </li>
            )}
            style={{ width: 500 }}
            renderInput={(params) => (
              <TextField {...params} label="Clientes" placeholder="Clientes" />
            )}
          />
        </div>
        <div className="col">
          <h2>Clients</h2>
          {clients.map((client) => (
            <h5 key={client.id}>{client.client}</h5>
          ))}
        </div>
        <div className="col">
          <h2>Selected clients</h2>
          {selectedClients.map((client) => (
            <h5 key={client}>{client}</h5>
          ))}
        </div>
        <div className="col">
          <select name="user-select" onChange={handleUserChange}>
            <option value="" disabled>
              Seleccione un usuario
            </option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.firstname} {user.middlename} {user.lastname}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default SelectMulti;
