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
  await fetch(url);
}

export async function deleteRow(tableName, row) {
  let condition = "";
  Object.keys(row).map((key) => (condition += `${key}='${row[key]}' AND `));
  condition = condition.slice(0, -4);

  const query = `DELETE FROM ${tableName} WHERE ${condition}`;
  const url = `${baseUrl}?query=${query}`;
  await fetch(url);
}
