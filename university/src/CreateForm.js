import React, { useEffect, useState } from "react";
import "./styles/Form.css";

export default function CreateForm({ params, onInsert }) {
  const [state, setState] = useState({});

  useEffect(() => {
    for (let i = 0; i < params.length; i++) {
      const element = params[i];
      setState({ ...state, ...(state[element] = "") });
    }
  }, [params]);

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const handleInsert = () => {
    onInsert(state);
  };

  const handleClear = () => {
    for (let i = 0; i <= params.length; i++) {
      const element = params[i];
      setState({ ...state, ...(state[element] = "") });
    }
  };

  return (
    <div className="form">
      {params.map((param) => (
        <div className="input-group">
          <label>{param}</label>
          <input name={param} value={state[param]} onChange={handleChange} />
        </div>
      ))}
      <div className="button-group">
        <button className="button-form" onClick={handleInsert}>
          Добавить
        </button>
        <button className="button-form" onClick={handleClear}>
          Сбросить
        </button>
      </div>
    </div>
  );
}
