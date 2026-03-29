DO
$$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'chethan') THEN
      CREATE ROLE chethan LOGIN PASSWORD '1234';
   ELSE
      ALTER ROLE chethan WITH LOGIN PASSWORD '1234';
   END IF;
END
$$;

SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'notesdb'
  AND pid <> pg_backend_pid();

DROP DATABASE IF EXISTS notesdb;
CREATE DATABASE notesdb OWNER chethan;
GRANT ALL PRIVILEGES ON DATABASE notesdb TO chethan;
