package main

import (
	"encoding/json"
	"net/http"
)

type Ping struct {
	Text string `json:"text"`
}

func handler(w http.ResponseWriter, r *http.Request) {
	ping := &Ping{
		Text: "IU4 Ping",
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(ping)
}

func main() {
	http.HandleFunc("/", handler)
	http.ListenAndServe(":8080", nil)
}
