package middleware

import "net/http"

type Middleware func(next http.Handler) http.Handler

type Manager struct {
	globalMiddlewares []Middleware
}

func NewManager() *Manager {
	return &Manager{
		globalMiddlewares: make([]Middleware, 0),
	}
}

func (mngr *Manager) Use(Middlewares ...Middleware) {
	mngr.globalMiddlewares = append(mngr.globalMiddlewares, Middlewares...)

}

func (mngr *Manager) With(handler http.Handler, middlewares ...Middleware) http.Handler {

	h := handler

	for _, middleware := range middlewares {
		h = middleware(h)

	}

	return h

}

func (mngr *Manager) WrapMux(handler http.Handler) http.Handler {

	h := handler

	for _, middleware := range mngr.globalMiddlewares {
		h = middleware(h)

	}

	return h

}

