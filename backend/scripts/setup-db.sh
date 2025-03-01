#!/usr/bin/env bash

# -----------------------------------------------------
# WARNING: This script removes any existing Postgres
# data directory at /opt/homebrew/var/postgresql@14,
# so you will lose all local databases there.
# Proceed with caution.
# -----------------------------------------------------

# Variables you can customize:
DB_NAME="my_transaction_db"
DB_USER="myuser"
DB_PASS="mypassword"
DATA_DIR="/opt/homebrew/var/postgresql@14"
DATA_FILE="./backend/data/transactions.json" # Path to the data file

echo "==> Stopping any running PostgreSQL services..."
brew services stop postgresql 2>/dev/null || true
brew services stop postgresql@14 2>/dev/null || true

echo "==> Uninstalling old PostgreSQL versions (if present)..."
brew uninstall postgresql --force 2>/dev/null || true
brew uninstall postgresql@14 --force 2>/dev/null || true

echo "==> Reinstalling PostgreSQL 14..."
brew update
brew reinstall postgresql@14

echo "==> Removing old data directory (destructive!)..."
rm -rf "$DATA_DIR"

echo "==> Initializing a fresh data directory with superuser 'postgres'..."
# --username=postgres forces an initial superuser named 'postgres'
# --encoding=utf8 ensures UTF-8 encoding
initdb "$DATA_DIR" --username=postgres --encoding=utf8

echo "==> Starting PostgreSQL 14 via Homebrew..."
brew services start postgresql@14

echo "==> Waiting a few seconds for the server to spin up..."
sleep 5

# -----------------------------------------------------
# Create your application user & database
# using the superuser 'postgres'
# -----------------------------------------------------
echo "==> Creating user [$DB_USER] and database [$DB_NAME]..."
psql -U postgres -tc "SELECT 1 FROM pg_roles WHERE rolname='${DB_USER}'" \
  | grep -q 1 || psql -U postgres -c "CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASS}' CREATEDB;"

psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'" \
  | grep -q 1 || psql -U postgres -c "CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};"

psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};"

# -----------------------------------------------------
# Enable uuid-ossp extension
# -----------------------------------------------------
echo "==> Enabling uuid-ossp extension in [$DB_NAME]..."
psql -U postgres -d "$DB_NAME" -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"

# -----------------------------------------------------
# Create the transactions table
# -----------------------------------------------------
echo "==> Creating 'transactions' table (if not exists) in [$DB_NAME]..."
psql -U "${DB_USER}" -d "${DB_NAME}" -c "
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    transaction_id UUID UNIQUE NOT NULL DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    amount INT NOT NULL,
    from_account VARCHAR(255) NOT NULL,
    to_account VARCHAR(255) NOT NULL,
    transaction_date VARCHAR(50) NOT NULL
);
"

# -----------------------------------------------------
# Populate initial data from data/transactions.json

# -----------------------------------------------------
if [[ -f "$DATA_FILE" ]]; then
  echo "==> Populating initial data from [$DATA_FILE]..."
  while IFS= read -r line; do
    # Convert JSON line to SQL INSERT
    TITLE=$(echo "$line" | jq -r '.title')
    DESCRIPTION=$(echo "$line" | jq -r '.description')
    AMOUNT=$(echo "$line" | jq -r '.amount')
    FROM_ACCOUNT=$(echo "$line" | jq -r '.fromAccount')
    TO_ACCOUNT=$(echo "$line" | jq -r '.toAccount')
    TRANSACTION_DATE=$(echo "$line" | jq -r '.transactionDate')

    psql -U "$DB_USER" -d "$DB_NAME" -c "
    INSERT INTO transactions (title, description, amount, from_account, to_account, transaction_date)
    VALUES ('$TITLE', '$DESCRIPTION', $AMOUNT, '$FROM_ACCOUNT', '$TO_ACCOUNT', '$TRANSACTION_DATE');
    " || echo "Failed to insert transaction: $TITLE"
  done < <(jq -c '.[]' "$DATA_FILE")
else
  echo "Data file [$DATA_FILE] not found. Skipping initial data population."
fi

echo
echo "=============================================================="
echo "PostgreSQL 14 is now set up with:"
echo " - Data directory: $DATA_DIR"
echo " - SUPERUSER:      postgres"
echo " - DB user:        $DB_USER (password: $DB_PASS)"
echo " - DB name:        $DB_NAME"
echo " - 'transactions' table created and populated (if data file exists)"
echo "=============================================================="