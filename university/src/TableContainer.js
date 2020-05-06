import React, { useEffect, useState } from "react";
import {
  getRows,
  getPermissions,
  getRowsWithCondition,
  deleteRow,
  insertRow,
  updateRow,
} from "./universityService";
import Table from "./Table";
import SearchForm from "./SearchForm";
import "./styles/TableContainer.css";
import CreateForm from "./CreateForm";
import UpdateForm from "./UpdateForm";

export default function TableContainer({ tableName }) {
  const [permissions, setPermissions] = useState([]);
  const [rows, setRows] = useState({});
  const [insertParams, setInsertParams] = useState([]);
  const [updateParams, setUpdateParams] = useState([]);
  const [searchParams, setSearchParams] = useState([]);
  const [updatedRow, setUpdatedRow] = useState({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const permissionsResponse = await getPermissions(tableName);
      setPermissions(permissionsResponse);

      let params = permissionsResponse.filter(
        (p) => p.permission_name === "SELECT" && p.subentity_name !== ""
      );
      params = params.map((p) => p.subentity_name);
      setSearchParams(params);
      setInsertParams(params);

      let params2 = permissionsResponse.filter(
        (p) => p.permission_name === "UPDATE" && p.subentity_name !== ""
      );
      params2 = params2.map((p) => p.subentity_name);
      setUpdateParams(params2);

      const rowsResponse = await getRows(tableName, params);
      setRows(rowsResponse);
    };

    fetchData();
  }, []);

  const handleSearch = async (state) => {
    const rowsResponse = await getRowsWithCondition(
      tableName,
      searchParams,
      state
    );
    setRows(rowsResponse);
  };

  const handleClear = async () => {
    const permissionsResponse = await getPermissions(tableName);
    setPermissions(permissionsResponse);

    let params = permissionsResponse.filter(
      (p) => p.permission_name === "SELECT" && p.subentity_name !== ""
    );
    params = params.map((p) => p.subentity_name);
    setSearchParams(params);

    const rowsResponse = await getRows(tableName, params);
    setRows(rowsResponse);
  };

  const handleInsert = async (state) => {
    const response = await insertRow(tableName, state);

    if (response.status === 500)
      alert(`Произошла ошибка при добавлении.\n${response.error}`);
    else alert("Готово");

    const permissionsResponse = await getPermissions(tableName);
    setPermissions(permissionsResponse);

    let params = permissionsResponse.filter(
      (p) => p.permission_name === "SELECT" && p.subentity_name !== ""
    );
    params = params.map((p) => p.subentity_name);
    setSearchParams(params);

    const rowsResponse = await getRows(tableName, params);
    setRows(rowsResponse);
  };

  const handleDelete = async (row) => {
    const response = await deleteRow(tableName, row);

    if (response.status === 500)
      alert(`Произошла ошибка при удалении.\n${response.error}`);

    const permissionsResponse = await getPermissions(tableName);
    setPermissions(permissionsResponse);

    let params = permissionsResponse.filter(
      (p) => p.permission_name === "SELECT" && p.subentity_name !== ""
    );
    params = params.map((p) => p.subentity_name);
    setSearchParams(params);

    const rowsResponse = await getRows(tableName, params);
    setRows(rowsResponse);
  };

  const handleVisible = (row) => {
    setUpdatedRow(row);
    setIsVisible(true);
  };

  const handleUpdate = async (state) => {
    setIsVisible(false);
    const response = await updateRow(tableName, state, updatedRow);

    if (response.status === 500)
      alert(`Произошла ошибка при редактировании.\n${response.error}`);

    const permissionsResponse = await getPermissions(tableName);
    setPermissions(permissionsResponse);

    let params = permissionsResponse.filter(
      (p) => p.permission_name === "SELECT" && p.subentity_name !== ""
    );
    params = params.map((p) => p.subentity_name);
    setSearchParams(params);

    const rowsResponse = await getRows(tableName, params);
    setRows(rowsResponse);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  const hasInsertPermission = () => {
    return permissions.some((p) => p.permission_name === "INSERT");
  };

  const hasSearchPermission = () => {
    return permissions.some((p) => p.permission_name === "SELECT");
  };

  return (
    <div>
      {isVisible && (
        <UpdateForm
          params={updateParams}
          row={updatedRow}
          onUpdate={handleUpdate}
          onClose={handleClose}
        />
      )}
      <div className="table-title">{tableName}</div>
      <div className="table-container">
        {hasInsertPermission() && (
          <CreateForm params={insertParams} onInsert={handleInsert} />
        )}
        {hasSearchPermission() && (
          <SearchForm
            params={searchParams}
            onSearch={handleSearch}
            onClear={handleClear}
          />
        )}
        <Table
          tableName={tableName}
          rows={rows}
          searchParams={searchParams}
          onDelete={handleDelete}
          onUpdate={handleVisible}
        />
      </div>
    </div>
  );
}
