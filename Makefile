start-db:
	tsc 
	node build/data-access/db-start.js 

setup-db-table:
	tsc
	node build/data-access/table-setup.js setup

reset-db-tables:
	tsc
	node build/data-access/table-setup.js reset

start-api:
	tsc 
	node build/api.js

test:
	npm test
