db-start:
	tsc 
	node build/db-start.js 

db-setup:
	node build/db-reset-table.js

test:
	npm test