import React, { useEffect, useState } from "react";
import "./styles/UpdateForm.css";

export default function UpdateForm({ params, row, onUpdate, onClose }) {
  const [state, setState] = useState({});

  useEffect(() => {
    for (let i = 0; i <= params.length; i++) {
      const element = params[i];
      setState({ ...state, ...(state[element] = row[element]) });
    }
  }, [params]);

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const handleUpdate = () => {
    onUpdate(state);
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="update-form">
      {params.map((param) => (
        <div className="input-group">
          <label>{param}</label>
          <input name={param} value={state[param]} onChange={handleChange} />
        </div>
      ))}
      <div className="button-group">
        <button className="button-form" onClick={handleUpdate}>
          Готово
        </button>
        <button className="button-form" onClick={handleClose}>
          Отмена
        </button>
      </div>
    </div>
  );
}
