import React, { useEffect, useState } from "react";
import {
  getRows,
  getPermissions,
  getRowsWithCondition,
  deleteRow,
  insertRow,
} from "./universityService";
import Table from "./Table";
import SearchForm from "./SearchForm";
import "./styles/TableContainer.css";
import CreateForm from "./CreateForm";

export default function TableContainer({ tableName }) {
  const [permissions, setPermissions] = useState([]);
  const [rows, setRows] = useState({});
  const [insertParams, setInsertParams] = useState([]);
  const [updateParams, setUpdateParams] = useState([]);
  const [searchParams, setSearchParams] = useState([]);

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
    await insertRow(tableName, state);
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
    await deleteRow(tableName, row);
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

  return (
    <div>
      <div className="table-title">{tableName}</div>
      <div className="table-container">
        <CreateForm params={insertParams} onInsert={handleInsert} />
        <SearchForm
          params={searchParams}
          onSearch={handleSearch}
          onClear={handleClear}
        />
        <Table
          tableName={tableName}
          rows={rows}
          searchParams={searchParams}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
