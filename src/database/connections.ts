import Knex from 'knex';
import Path from 'path';

// migrations - control the version of database

const db = Knex({
    client: 'sqlite3',
    connection: {
        filename: Path.resolve(__dirname, 'database.sqlite')
    },
    useNullAsDefault: true
});

export default db;