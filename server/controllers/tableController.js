import pool from '../database/db.js';

// Crear una tabla con columnas y claves foráneas opcionales
export const createTable = async (req, res) => {
  const { tableName, columns, foreignKeys } = req.body;
  const client = await pool.connect();

  try {
    // Construir la definición de la tabla con columna 'id' como llave primaria
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS ${tableName} (
        id SERIAL PRIMARY KEY,
        ${columns.map(column => {
          const length = column.length ? `(${column.length})` : '';
          return `${column.name} ${column.type}${length}`;
        }).join(', ')}
      )
    `;
    await client.query(createTableQuery);

    // Agregar claves foráneas si existen
    if (foreignKeys && foreignKeys.length > 0) {
      for (const fk of foreignKeys) {
        const addForeignKeyQuery = `
          ALTER TABLE ${tableName}
          ADD CONSTRAINT fk_${fk.column}
          FOREIGN KEY (${fk.column})
          REFERENCES ${fk.references.table}(${fk.references.column})
        `;
        await client.query(addForeignKeyQuery);
      }
    }

    res.status(201).send(`Table ${tableName} created successfully.`);
  } catch (error) {
    console.error('Error creating table:', error);
    res.status(500).send('Error creating table.');
  } finally {
    client.release();
  }
};



// Verificar si una tabla existe
export const checkTableExists = async (req, res) => {
  const { tableName } = req.params;
  const client = await pool.connect();
  try {
    if (!tableName) {
      return res.status(400).send('Table name is required.');
    }

    const checkTableQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = $1
      );
    `;
    const result = await client.query(checkTableQuery, [tableName]);
    if (result.rows[0].exists) {
      res.send(`Table ${tableName} exists.`);
    } else {
      res.send(`Table ${tableName} does not exist.`);
    }
  } catch (error) {
    console.error('Error checking table existence:', error);
    res.status(500).send('Error checking table existence.');
  } finally {
    client.release();
  }
};

// Obtener todos los nombres de las tablas con sus columnas y llaves primarias
export const getAllTables = async (req, res) => {
  const client = await pool.connect();
  try {
    const getTablesQuery = `
      SELECT 
        c.table_name, 
        c.column_name, 
        c.data_type, 
        c.is_nullable, 
        tc.constraint_type
      FROM 
        information_schema.columns c
        LEFT JOIN information_schema.key_column_usage kcu
          ON c.table_name = kcu.table_name 
          AND c.column_name = kcu.column_name
        LEFT JOIN information_schema.table_constraints tc
          ON kcu.constraint_name = tc.constraint_name 
          AND tc.constraint_type = 'PRIMARY KEY'
      WHERE 
        c.table_schema = 'public'
      ORDER BY 
        c.table_name, c.ordinal_position;
    `;
    const result = await client.query(getTablesQuery);
    const tables = {};

    result.rows.forEach(row => {
      if (!tables[row.table_name]) {
        tables[row.table_name] = { columns: [] };
      }
      tables[row.table_name].columns.push({
        column_name: row.column_name,
        data_type: row.data_type,
        is_nullable: row.is_nullable,
        is_primary_key: row.constraint_type === 'PRIMARY KEY'
      });
    });

    res.json(tables);
  } catch (error) {
    console.error('Error fetching table names and columns:', error);
    res.status(500).send('Error fetching table names and columns.');
  } finally {
    client.release();
  }
};
// Eliminar una tabla
export const dropTable = async (req, res) => {
  const { tableName } = req.params;
  const client = await pool.connect();
  try {
    if (!tableName) {
      return res.status(400).send('Table name is required.');
    }

    const dropTableQuery = `DROP TABLE IF EXISTS ${tableName};`;
    await client.query(dropTableQuery);
    res.send(`Table ${tableName} has been dropped if it existed.`);
  } catch (error) {
    console.error('Error dropping table:', error);
    res.status(500).send('Error dropping table.');
  } finally {
    client.release();
  }
};

// Actualizar una tabla (agregar/eliminar columnas)
export const updateTable = async (req, res) => {
  const { tableName } = req.params;
  const { addColumns, dropColumns } = req.body;
  const client = await pool.connect();
  try {
    if (!tableName) {
      return res.status(400).send('Table name is required.');
    }

    let alterTableQuery = `ALTER TABLE ${tableName}`;

    if (addColumns && addColumns.length > 0) {
      const addColumnsDef = addColumns.map(col => `ADD COLUMN ${col.name} ${col.type}`).join(', ');
      alterTableQuery += ` ${addColumnsDef}`;
    }

    if (dropColumns && dropColumns.length > 0) {
      if (addColumns && addColumns.length > 0) {
        alterTableQuery += ',';
      }
      const dropColumnsDef = dropColumns.map(col => `DROP COLUMN ${col}`).join(', ');
      alterTableQuery += ` ${dropColumnsDef}`;
    }

    alterTableQuery += ';';

    await client.query(alterTableQuery);
    res.send(`Table ${tableName} has been updated.`);
  } catch (error) {
    console.error('Error updating table:', error);
    res.status(500).send('Error updating table.');
  } finally {
    client.release();
  }
};

// Obtener todas las tablas y sus columnas
export const getTablesAndColumns = async (req, res) => {
  const client = await pool.connect();
  try {
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;
    const tablesResult = await client.query(tablesQuery);
    const tables = tablesResult.rows.map(row => row.table_name);

    const tablesAndColumns = {};

    for (const table of tables) {
      const columnsQuery = `
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = $1;
      `;
      const columnsResult = await client.query(columnsQuery, [table]);
      tablesAndColumns[table] = columnsResult.rows.map(row => row.column_name);
    }

    res.json(tablesAndColumns);
  } catch (error) {
    console.error('Error fetching tables and columns:', error);
    res.status(500).send('Error fetching tables and columns.');
  } finally {
    client.release();
  }
};
