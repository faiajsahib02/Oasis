package db

import (
	"fmt"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
	migrate "github.com/rubenv/sql-migrate"
)

func MigrateDB(dbCon *sqlx.DB, dir string) error {
	migrations := &migrate.FileMigrationSource{
		Dir: dir,
	}

	_, err := migrate.Exec(dbCon.DB, "postgres", migrations, migrate.Up)
	if err != nil {
		return err
	}
	fmt.Println("Database migrated successfully")
	return nil
}

