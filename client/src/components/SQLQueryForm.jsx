import React, { useState } from 'react';
import axios from 'axios';
import {URUsql} from './Urls.jsx'

function SQLQueryForm() {
  const [sqlQuery, setSqlQuery] = useState('');
  const [queryResult, setQueryResult] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(URUsql, { sqlQuery });
      setQueryResult(response.data);
    } catch (error) {
      setError('Error executing SQL query');
      console.error('Error executing SQL query:', error);
    }
  };

  return (
    <div className="container-fluid my-3">
      <form onSubmit={handleSubmit} className="w-75 m-auto border_principal p-2">
        <h2>Ejecutar Consulta SQL</h2>
        <div className="mb-3 mt-3">
          <label className="form-label float-start">Consulta SQL:</label>
          <textarea
            className="form-control"
            value={sqlQuery}
            onChange={(e) => setSqlQuery(e.target.value)}
            rows={5}
            required
          />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        {queryResult && (
          <div className="mb-3">
            <h3>Resultado:</h3>
            <pre>{JSON.stringify(queryResult, null, 2)}</pre>
          </div>
        )}
        <button type="submit" className="btn bg_secundario Blanco my-2">
          Ejecutar Consulta
        </button>
      </form>
    </div>
  );
}

export default SQLQueryForm;
