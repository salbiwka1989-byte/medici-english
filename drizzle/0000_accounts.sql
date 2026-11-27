CREATE TABLE accounts (id TEXT PRIMARY KEY, login TEXT NOT NULL UNIQUE, name TEXT NOT NULL, salt TEXT NOT NULL, password_hash TEXT NOT NULL, progress TEXT NOT NULL DEFAULT '{"days":[],"words":{},"minutes":0}');
--> statement-breakpoint
CREATE TABLE sessions (token_hash TEXT PRIMARY KEY, account_id TEXT NOT NULL REFERENCES accounts(id), expires INTEGER NOT NULL);
--> statement-breakpoint
CREATE INDEX sessions_account ON sessions(account_id);
--> statement-breakpoint
CREATE TABLE attempts (key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires INTEGER NOT NULL);
