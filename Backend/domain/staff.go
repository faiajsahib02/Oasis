package domain

// Staff entity
type Staff struct {
	ID       int    `json:"id" db:"id"`
	Name     string `json:"name" db:"name"`
	Password string `json:"-" db:"password"` // "-" prevents sending password in JSON
	Role     string `json:"role" db:"role"`
}