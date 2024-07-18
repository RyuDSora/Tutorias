import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {URIgetTablesColumns,URIaddTables} from './Urls'

function TableForm() {
  const [tableName, setTableName] = useState('');
  const [columns, setColumns] = useState([{ name: '', type: 'VARCHAR', length: '' }]);
  const [foreignKeys, setForeignKeys] = useState([{ fkColumn: '', references: { refTable: '', refColumn: '' } }]);
  const [includeForeignKeys, setIncludeForeignKeys] = useState(false);
  const [tablesAndColumns, setTablesAndColumns] = useState({});
  const [columnNames, setColumnNames] = useState([]); // Track column names

  useEffect(() => {
    fetchTablesAndColumns();
  }, []);

  const fetchTablesAndColumns = async () => {
    try {
      const response = await axios.get(URIgetTablesColumns);
      setTablesAndColumns(response.data);
    } catch (error) {
      console.error('Error fetching tables and columns:', error);
    }
  };

  const handleAddColumn = () => {
    const newColumnName = `column_${columns.length + 1}`;
    setColumns([...columns, { name: newColumnName, type: 'VARCHAR', length: '' }]);
    setColumnNames([...columnNames, newColumnName]); // Add column name
  };

  const handleAddForeignKey = () => {
    setForeignKeys([...foreignKeys, { fkColumn: '', references: { refTable: '', refColumn: '' } }]);
  };

  const handleColumnChange = (index, event) => {
    const values = [...columns];
    values[index][event.target.name] = event.target.value;
    setColumns(values);
  };

  const handleForeignKeyChange = (index, event) => {
    const values = [...foreignKeys];
    const { name, value } = event.target;
    if (name === 'fkColumn') {
      values[index][name] = value;
    } else {
      values[index].references[name] = value;
    }
    setForeignKeys(values);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = { tableName, columns };
    if (includeForeignKeys) {
      payload.foreignKeys = foreignKeys;
    }
    try {
      await axios.post(URIaddTables, payload);
      alert('Table created successfully');
      window.location.reload();
    } catch (error) {
      console.error('Error creating table:', error);
      alert('Error creating table');
    }
  };

  const dataTypes = ['VARCHAR', 'INT', 'SERIAL', 'BOOLEAN', 'DATE', 'TIMESTAMP', 'TEXT', 'FLOAT', 'DOUBLE'];

  return (
    <div className='container-fluid'>
      <form onSubmit={handleSubmit} className='w-75 m-auto border p-3'>
        <h2 className='mb-4'>Crear Tabla</h2>
        <div className='mb-3'>
          <label className='form-label'>Nombre de la tabla:</label>
          <input className='form-control' type="text" value={tableName} onChange={e => setTableName(e.target.value)} required />
        </div>

        <h3>Columnas</h3>
        {columns.map((column, index) => (
          <div key={index} className='mb-3'>
            <div className='row g-2'>
              <div className='col'>
                <input
                  type="text"
                  name="name"
                  className='form-control'
                  value={column.name}
                  onChange={event => handleColumnChange(index, event)}
                  placeholder={`Column ${index + 1}`}
                  required
                />
              </div>
              <div className='col'>
                <select
                  name="type"
                  value={column.type}
                  className='form-control'
                  onChange={event => handleColumnChange(index, event)}
                  required
                >
                  {dataTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div className='col'>
                {(column.type === 'VARCHAR' || column.type === 'FLOAT' || column.type === 'DOUBLE') && (
                  <input
                    type="text"
                    name="length"
                    className='form-control'
                    value={column.length}
                    onChange={event => handleColumnChange(index, event)}
                    placeholder="Length/Precision"
                  />
                )}
              </div>
            </div>
          </div>
        ))}
        <button type="button" className='btn btn-primary mt-3' onClick={handleAddColumn}>Agregar Columna</button>

        <div className='form-check mt-4'>
          <input
            type="checkbox"
            className='form-check-input'
            checked={includeForeignKeys}
            onChange={e => setIncludeForeignKeys(e.target.checked)}
          />
          <label className='form-check-label'>Incluir Llave Foránea</label>
        </div>

        {includeForeignKeys && (
          <div className='mt-4'>
            <h3>Llaves Foráneas</h3>
            {foreignKeys.map((foreignKey, index) => (
              <div key={index} className='mb-3'>
                <div className='row g-2'>
                  <div className='col'>
                    <select
                      name="fkColumn"
                      className='form-control'
                      value={foreignKey.fkColumn}
                      onChange={event => handleForeignKeyChange(index, event)}
                      required
                    >
                      <option value="">Seleccionar Columna</option>
                      {columnNames.map((colName) => (
                        <option key={colName} value={colName}>
                          {colName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className='col'>
                    <select
                      name="refTable"
                      className='form-control'
                      value={foreignKey.references.refTable}
                      onChange={event => handleForeignKeyChange(index, event)}
                      required
                    >
                      <option value="">Seleccionar Tabla</option>
                      {Object.keys(tablesAndColumns).map(table => (
                        <option key={table} value={table}>
                          {table}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className='col'>
                    <select
                      name="refColumn"
                      className='form-control'
                      value={foreignKey.references.refColumn}
                      onChange={event => handleForeignKeyChange(index, event)}
                      required
                    >
                      <option value="">Seleccionar Columna Referenciada</option>
                      {tablesAndColumns[foreignKey.references.refTable]?.map(column => (
                        <option key={column} value={column}>
                          {column}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
            <button type="button" className='btn btn-primary mt-3' onClick={handleAddForeignKey}>Agregar Llave Foránea</button>
          </div>
        )}

        <button type="submit" className='btn btn-success mt-4'>Crear Tabla</button>
      </form>
    </div>
  );
}

export default TableForm;
