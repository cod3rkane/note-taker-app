FROM bitnami/postgresql:latest
EXPOSE 5432

ENV    POSTGRESQL_PASSWORD=password123 \
       POSTGRESQL_DATABASE=editor \
       DB_URL=postgresql://postgres:password123@postgresql:5432/editor?schema=public \
       PSQL_DB_URL=postgresql://postgres:password123@postgresql:5432/editor

COPY   . ./docker-entrypoint-initdb.d
