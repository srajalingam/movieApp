package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
)

const port = 8080

type application struct {
	Domain string
	DSN    string
}

func main() {
	//set application config
	var app application

	//read the command line
	flag.StringVar(&app.DSN, "dsn", "host=localhost port=5432 user=postgres passsword=postgress dbname=movies sslmode=disable timezone=UTC connect_timeout=5", "postgress")
	flag.Parse()

	//connect to the database

	app.Domain = "example.com"

	log.Println("application running", port)
	// http.HandleFunc("/", Hello)

	//start a web server

	err := http.ListenAndServe(fmt.Sprintf(":%d", port), app.routes())

	if err != nil {
		log.Fatal(err)
	}

}
