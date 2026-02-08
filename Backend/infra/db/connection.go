package db

import (
	"fmt"

	"oasis/backend/config"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

func GetConnectionString(cnf *config.DBConfig) string {
	sslMode := "enable"
	if !cnf.EnableSSLMODE {
		sslMode = "disable"
	}
	
	connString := fmt.Sprintf(
		"user=%s password=%s host=%s port=%d dbname=%s sslmode=%s",
		cnf.User,
		cnf.Password,
		cnf.Host,
		cnf.Port,
		cnf.Name,
		sslMode,
	)
	
	return connString
}

func NewConnection(cnf *config.DBConfig) (*sqlx.DB, error) {
	dbSource := GetConnectionString(cnf)
	dbCon, err := sqlx.Connect("postgres", dbSource)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	return dbCon, nil

}

