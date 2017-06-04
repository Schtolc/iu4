package main

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"
	"strconv"
)

const MAX_FILE_SIZE int = 8388608 // 268435456 TODO

type Ping struct {
	Text string `json:"text"`
}

type Error struct {
	Reason string `json:"reason"`
}

type Upload struct {
	Filename string `json:"filename"`
	Mimetype string `json:"mimetype"`
}

func request_failed(w http.ResponseWriter, reason string) {
	error_ := &Error{
		Reason: reason,
	}
	json.NewEncoder(w).Encode(error_)
}

func wrong_url_handler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	log.Print(r)

	request_failed(w, "Page do not exist")
}

func ping_handler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	log.Print(r)

	ping := &Ping{
		Text: "IU4 Ping",
	}
	json.NewEncoder(w).Encode(ping)
}

func upload_handler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	log.Print(r)

	if r.Method != "POST" {
		request_failed(w, "Wrong method")
		return
	}

	if len, err := strconv.Atoi(r.Header.Get("Content-Length")); err != nil || len > MAX_FILE_SIZE {
		log.Print(len, err)
		request_failed(w, "File too big")
		return
	}

	if err := r.ParseMultipartForm(32 << 20); err != nil {
		log.Print(err)
		request_failed(w, "Upload failed")
		return
	}

	file, handler, err := r.FormFile("payload")
	if err != nil {
		log.Print(err)
		request_failed(w, "Upload failed")
		return
	}
	defer file.Close()

	f, err := os.OpenFile("./db/"+handler.Filename, os.O_WRONLY|os.O_CREATE, 0666)
	if err != nil {
		log.Print(err)
		request_failed(w, "Upload failed")
		return
	}
	defer f.Close()

	if _, err := io.Copy(f, file); err != nil {
		log.Print(err)
		request_failed(w, "Upload failed")
		return
	}
	resp := &Upload{
		Filename: handler.Filename,
		Mimetype: handler.Header.Get("Content-Type"),
	}
	json.NewEncoder(w).Encode(resp)
}

func main() {
	os.Mkdir("db", 0777)
	http.HandleFunc("/", wrong_url_handler)
	http.HandleFunc("/ping", ping_handler)
	http.HandleFunc("/upload", upload_handler)
	http.ListenAndServe(":8080", nil)
}
