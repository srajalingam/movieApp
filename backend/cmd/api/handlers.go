package main

import (
	"fmt"
	"log"
	"net/http"
)

type home struct {
	Status  string `json:"status"`
	Message string `json:"message"`
	Version string `json:"version"`
}

func (app *application) Home(w http.ResponseWriter, r *http.Request) {
	log.Printf("Home handler fired for %s", r.URL.Path)

	var payload = &home{
		Status:  "active",
		Message: "Go movies up and running",
		Version: "1.0.0",
	}

	_ = app.writeJSON(w, http.StatusOK, payload)
}

func (app *application) AllMovies(w http.ResponseWriter, r *http.Request) {

	movies, err := app.DB.AllMovies()

	if err != nil {
		fmt.Println(err)
		return
	}
	_ = app.writeJSON(w, http.StatusOK, movies)

}
