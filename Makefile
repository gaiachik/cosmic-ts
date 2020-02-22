start-db:
	tsc 
	node build/adapters/data-access/db-start.js 

setup-db-table:
	tsc
	node build/adapters/data-access/table-setup.js setup

reset-db-tables:
	tsc
	node build/adapters/data-access/table-setup.js reset

start-api:
	tsc 
	node build/entrypoints/api.js

test:
	npm test
