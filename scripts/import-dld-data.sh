#!/bin/bash
# Import DLD transactions CSV into SQLite database

set -e

DATA_DIR="/var/www/dxbdata/data"
CSV_FILE="$DATA_DIR/transactions.csv"
DB_FILE="$DATA_DIR/dld.db"

echo "=== DLD Data Import ==="
echo "CSV: $CSV_FILE"
echo "Database: $DB_FILE"

# Check if CSV exists
if [ ! -f "$CSV_FILE" ]; then
    echo "Error: CSV file not found"
    exit 1
fi

# Get file size and line count
FILE_SIZE=$(ls -lh "$CSV_FILE" | awk '{print $5}')
LINE_COUNT=$(wc -l < "$CSV_FILE")
echo "File size: $FILE_SIZE"
echo "Total rows: $LINE_COUNT"

# Remove old database if exists
rm -f "$DB_FILE"

echo ""
echo "Creating SQLite database..."

# Create database and import CSV
sqlite3 "$DB_FILE" << 'EOF'
.mode csv
.headers on

CREATE TABLE transactions (
    transaction_id TEXT PRIMARY KEY,
    procedure_id INTEGER,
    trans_group_id INTEGER,
    trans_group_ar TEXT,
    trans_group_en TEXT,
    procedure_name_ar TEXT,
    procedure_name_en TEXT,
    instance_date TEXT,
    property_type_id INTEGER,
    property_type_ar TEXT,
    property_type_en TEXT,
    property_sub_type_id INTEGER,
    property_sub_type_ar TEXT,
    property_sub_type_en TEXT,
    property_usage_ar TEXT,
    property_usage_en TEXT,
    reg_type_id INTEGER,
    reg_type_ar TEXT,
    reg_type_en TEXT,
    area_id INTEGER,
    area_name_ar TEXT,
    area_name_en TEXT,
    building_name_ar TEXT,
    building_name_en TEXT,
    project_number TEXT,
    project_name_ar TEXT,
    project_name_en TEXT,
    master_project_ar TEXT,
    master_project_en TEXT,
    rooms_ar TEXT,
    rooms_en TEXT,
    has_parking INTEGER,
    procedure_area REAL,
    actual_worth REAL,
    meter_sale_price REAL,
    rent_value REAL,
    meter_rent_price REAL,
    no_of_parties_role_1 INTEGER,
    no_of_parties_role_2 INTEGER,
    no_of_parties_role_3 INTEGER,
    nearest_landmark_ar TEXT,
    nearest_landmark_en TEXT,
    nearest_metro_ar TEXT,
    nearest_metro_en TEXT,
    nearest_mall_ar TEXT,
    nearest_mall_en TEXT
);

.import --skip 1 /var/www/dxbdata/data/transactions.csv transactions
EOF

echo ""
echo "Creating indexes..."

sqlite3 "$DB_FILE" << 'EOF'
CREATE INDEX idx_area ON transactions(area_name_en);
CREATE INDEX idx_date ON transactions(instance_date);
CREATE INDEX idx_building ON transactions(building_name_en);
CREATE INDEX idx_trans_group ON transactions(trans_group_en);
CREATE INDEX idx_property_type ON transactions(property_type_en);
CREATE INDEX idx_worth ON transactions(actual_worth);
EOF

echo ""
echo "Database created successfully!"
echo ""

# Show some stats
sqlite3 "$DB_FILE" << 'EOF'
SELECT 'Total transactions: ' || COUNT(*) FROM transactions;
SELECT 'Date range: ' || MIN(instance_date) || ' to ' || MAX(instance_date) FROM transactions;
SELECT 'Unique areas: ' || COUNT(DISTINCT area_name_en) FROM transactions;
SELECT 'Unique buildings: ' || COUNT(DISTINCT building_name_en) FROM transactions;
SELECT '';
SELECT 'Top 10 areas by transaction count:';
SELECT area_name_en || ': ' || COUNT(*) as count 
FROM transactions 
WHERE area_name_en IS NOT NULL AND area_name_en != ''
GROUP BY area_name_en 
ORDER BY count DESC 
LIMIT 10;
EOF

echo ""
echo "Done! Database ready at $DB_FILE"
