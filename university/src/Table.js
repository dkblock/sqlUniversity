import React, { useState, useEffect } from "react";
import "./styles/Table.css";
import { getPermissions } from "./universityService";

export default function Table({ tableName, rows, searchParams, onDelete, onUpdate }) {
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const permissionsResponse = await getPermissions(tableName);
      setPermissions(permissionsResponse);
    };

    fetchData();
  }, [searchParams]);

  const hasUpdatePermission = () => {
    return permissions.some((p) => p.permission_name === "UPDATE");
  };

  const hasDeletePermission = () => {
    return permissions.some((p) => p.permission_name === "DELETE");
  };

  const handleDelete = (row) => (event) => {
    onDelete(row);
  };

  const handleUpdate = (row) => (event) => {
    onUpdate(row);
  }

  return (
    <table className="table">
      <thead>
        <tr>
          {rows.length && Object.keys(rows[0]).map((key) => <th>{key}</th>)}
          <th>Управление</th>
        </tr>
      </thead>
      <tbody>
        {rows.length &&
          rows.map((row) => (
            <tr>
              {Object.keys(row).map((key) => (
                <td>{row[key]}</td>
              ))}
              <td className="button-group-col">
                {hasUpdatePermission() && (
                  <button className="button-table" onClick={handleUpdate(row)}>Изменить</button>
                )}
                {hasDeletePermission() && (
                  <button className="button-table" onClick={handleDelete(row)}>
                    Удалить
                  </button>
                )}
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}
