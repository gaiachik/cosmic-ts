db-start:
	tsc 
	node build/data-access/db-start.js 

db-setup:
	node build/data-access/db-setup-table.js

db-reset-tables:
	node build/data-access/db-reset-table.js

start-api:
	tsc 
	node build/api.js

test:
	npm test