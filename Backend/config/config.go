package config

import (
	"fmt"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

var configurations *Config

type DBConfig struct {
	Host          string
	Port          int
	Name          string
	User          string
	Password      string
	EnableSSLMODE bool
}

type Config struct {
	Version      string
	ServiceName  string
	HttpPort     int
	JwtSecretKey string
	DB           *DBConfig
}

func loadConfig() {
	err := godotenv.Load()
	if err != nil {
		fmt.Println("Failed to load the env variables:", err)
		os.Exit(1)
	}
	version := os.Getenv("VERSION")
	if version == "" {
		fmt.Println("version is required")
		os.Exit(1)
	}

	ServiceName := os.Getenv("SERVICE_NAME")
	if ServiceName == "" {
		fmt.Println("Service name is required")
		os.Exit(1)
	}

	httpPort := os.Getenv("HTTP_PORT")
	if httpPort == "" {
		fmt.Println("Http port is reqired")
	}

	port, err := strconv.ParseInt(httpPort, 10, 64)
	if err != nil {
		fmt.Println("Port must be number")
		os.Exit(1)
	}

	jwtSecretKey := os.Getenv("JWT_SECRET_KEY")
	if jwtSecretKey == "" {
		fmt.Println("jwt secret key is required")
		os.Exit(1)
	}

	Host := os.Getenv("DB_HOST")
	if Host == "" {
		fmt.Println("Database host is required")
		os.Exit(1)
	}

	dbPort := os.Getenv("DB_PORT")
	if dbPort == "" {
		fmt.Println("Database port is required")
		os.Exit(1)
	}

	dbPrt, err := strconv.ParseInt(dbPort, 10, 64)
	if err != nil {
		fmt.Println("Database port must be number")
		os.Exit(1)
	}

	name := os.Getenv("DB_NAME")
	if name == "" {
		fmt.Println("Database name is required")
		os.Exit(1)
	}

	user := os.Getenv("DB_USER")
	if user == "" {
		fmt.Println("Database user is required")
		os.Exit(1)
	}

	password := os.Getenv("DB_PASSWORD")
	if password == "" {
		fmt.Println("Database password is required")
		os.Exit(1)
	}

	enableSSLMode := os.Getenv("DB_ENABLE_SSL_MODE")

	enblSSLMode ,err := strconv.ParseBool(enableSSLMode)
	if err != nil {
		fmt.Println("Enable SSL Mode must be boolean")
		os.Exit(1)
	}

	dbConfig := &DBConfig{
		Host:          Host,
		Port:          int(dbPrt),
		Name:          name,
		User:          user,
		Password:      password,
		EnableSSLMODE: enblSSLMode,
	}
	configurations = &Config{
		Version:      version,
		ServiceName:  ServiceName,
		HttpPort:     int(port),
		JwtSecretKey: jwtSecretKey,
		DB:           dbConfig,
	}
}

func GetConfig() *Config {
	if configurations == nil {
		//first time
		loadConfig()
	}

	return configurations

}
