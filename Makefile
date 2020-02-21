start-db:
	tsc 
	node build/data-access/db-start.js 

setup-db-table:
	node build/data-access/db-setup-table.js

reset-db-tables:
	node build/data-access/db-reset-table.js

start-api:
	tsc 
	node build/api.js

test:
	npm test
