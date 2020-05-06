const baseUrl = "http://localhost:5050";

export async function getPermissions(tableName) {
  const query = `SELECT * FROM fn_my_permissions('${tableName}', 'object')`;
  const url = `${baseUrl}?query=${query}`;
  const response = await fetch(url);
  const result = await response.json();
  const permissions = result.recordset;

  return permissions;
}

export async function getRows(tableName, searchParams) {
  const columns = searchParams.join();
  const query = `SELECT ${columns} FROM ${tableName}`;
  const url = `${baseUrl}?query=${query}`;
  const response = await fetch(url);
  const result = await response.json();
  const rows = result.recordset;

  return rows;
}

export async function getRowsWithCondition(tableName, searchParams, state) {
  const columns = searchParams.join();
  const notEmptyFields = Object.keys(state).filter((key) => state[key] !== "");
  let condition = "";

  notEmptyFields.forEach((element) => {
    condition += `${element} ${state[element]} AND `;
  });
  condition = condition.slice(0, -4);

  const query = `SELECT ${columns} FROM ${tableName} WHERE ${condition}`;
  console.log(query);
  const url = `${baseUrl}?query=${query}`;
  const response = await fetch(url);
  const result = await response.json();
  const rows = result.recordset;

  return rows;
}

export async function insertRow(tableName, state) {
  let columns = "";
  let condition = "";
  Object.keys(state).map((key) => (columns += `${key},`));
  Object.keys(state).map((key) => (condition += `'${state[key]}',`));
  columns = columns.slice(0, -1);
  condition = condition.slice(0, -1);

  const query = `INSERT INTO ${tableName} (${columns}) VALUES (${condition})`;
  const url = `${baseUrl}?query=${query}`;
  const response = await fetch(url);
  const responseResult = await response.json();

  return responseResult;
}

export async function updateRow(tableName, state, updatedRow) {
  if (tableName === "Кабинеты") return updateRowByProcedure(state, updatedRow);

  let columns = "";
  let condition = "";
  Object.keys(state).map((key) => (columns += `${key}='${state[key]}',`));
  Object.keys(updatedRow).map(
    (key) =>
      (condition += !updatedRow[key]
        ? `(${key} IS NULL OR ${key}='') AND `
        : `${key}='${updatedRow[key]}' AND `)
  );
  columns = columns.slice(0, -1);
  condition = condition.slice(0, -4);

  const query = `UPDATE ${tableName} SET ${columns} WHERE ${condition}`;
  const url = `${baseUrl}?query=${query}`;
  const response = await fetch(url);
  const responseResult = await response.json();

  return responseResult;
}

export async function updateRowByProcedure(state, updatedRow) {
  const condition = `${updatedRow.Id_Кабинета}, ${state.Id_Кабинета}, ${state.Id_Кафедры},  ${state.Номер}, '${state.Тип}',  ${state.Количество_мест}`;
  const query = `EXEC EditCabinet ${condition}`;
  const url = `${baseUrl}?query=${query}`;
  const response = await fetch(url);
  const responseResult = await response.json();

  return responseResult;
}

export async function deleteRow(tableName, row) {
  let condition = "";
  Object.keys(row).map((key) => (condition += `${key}='${row[key]}' AND `));
  condition = condition.slice(0, -4);

  const query = `DELETE FROM ${tableName} WHERE ${condition}`;
  const url = `${baseUrl}?query=${query}`;
  const response = await fetch(url);
  const responseResult = await response.json();

  return responseResult;
}
