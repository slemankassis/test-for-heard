#!/usr/bin/env bash

# ---------------------------------------
# 1) INSTALL POSTGRESQL (via Homebrew)
# ---------------------------------------

echo "==> Checking if Homebrew is installed..."
if ! command -v brew &> /dev/null
then
  echo "Homebrew not found. Please install it from https://brew.sh/ first."
  exit 1
fi

echo "==> Installing PostgreSQL via Homebrew..."
brew update
brew install postgresql

echo "==> Starting PostgreSQL service..."
brew services start postgresql

# ---------------------------------------
# 2) SETUP DATABASE & USER
# ---------------------------------------
# By default on macOS, you have a 'postgres' superuser role with 'trust' auth locally.
# If you need a password or a different approach, adjust the commands below.

# Variables - CHANGE as needed:
DB_NAME="my_transaction_db"
DB_USER="myuser"
DB_PASS="mypassword"

echo "==> Creating database user and database..."

# The 'psql' command below:
#  -U postgres : connect as the 'postgres' superuser (on mac, typically you can omit -U if your local user has superuser perms)
#  -c "SQL HERE": run the SQL command

psql -U postgres -tc "SELECT 1 FROM pg_roles WHERE rolname='${DB_USER}'" | grep -q 1 || \
psql -U postgres -c "CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASS}';"

psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'" | grep -q 1 || \
psql -U postgres -c "CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};"

psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};"

# ---------------------------------------
# 3) CREATE TABLE 'transactions'
# ---------------------------------------

echo "==> Creating 'transactions' table (if not exists)..."
psql -U "${DB_USER}" -d "${DB_NAME}" -c "
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    transaction_id VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    amount INT NOT NULL,
    from_account VARCHAR(255) NOT NULL,
    to_account VARCHAR(255) NOT NULL,
    transaction_date VARCHAR(50) NOT NULL
);
"

echo "==> Done!"
echo "You now have a database named '${DB_NAME}' with a user '${DB_USER}' (password: '${DB_PASS}') and a 'transactions' table."