package main

import (
	"encoding/json"
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

	out, err := json.Marshal(payload)
	if err != nil {
		fmt.Println(err)
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(out)
}

func (app *application) AllMovies(w http.ResponseWriter, r *http.Request) {

	movies, err := app.DB.AllMovies()

	if err != nil {
		fmt.Println(err)
		return
	}

	out, err := json.Marshal(movies)
	if err != nil {
		fmt.Println(err)
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(out)
}
