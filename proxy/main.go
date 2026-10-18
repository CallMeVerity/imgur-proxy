package main

import (
	"io"
	"log"
	"net/http"
	"regexp"
)

var allowed = regexp.MustCompile(`^/[A-Za-z0-9]+\.(png|jpe?g|gif|webp)$`)

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if !allowed.MatchString(r.URL.Path) {
			http.NotFound(w, r)
			return
		}

		req, err := http.NewRequest("GET", "https://i.imgur.com"+r.URL.RequestURI(), nil)
		if err != nil {
			http.Error(w, "bad request", 400)
			return
		}
		req.Header.Set("User-Agent", "Mozilla/5.0")
		if rng := r.Header.Get("Range"); rng != "" {
			req.Header.Set("Range", rng)
		}

		resp, err := http.DefaultClient.Do(req)
		if err != nil {
			http.Error(w, "bad gateway", 502)
			return
		}
		defer resp.Body.Close()

		for _, h := range []string{"Content-Type", "Content-Length", "Content-Range", "Accept-Ranges", "ETag", "Last-Modified"} {
			if v := resp.Header.Get(h); v != "" {
				w.Header().Set(h, v)
			}
		}
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Cache-Control", "public, max-age=86400")
		w.WriteHeader(resp.StatusCode)
		io.Copy(w, resp.Body)
	})

	log.Fatal(http.ListenAndServe(":8080", nil))
}