FROM golang:1.27-alpine AS build
WORKDIR /src

COPY go.mod ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 go build -ldflags="-s -w" -o /imgur-proxy .

FROM alpine:3.20
RUN apk add --no-cache ca-certificates && adduser -D -H app
USER app
COPY --from=build /imgur-proxy /imgur-proxy
EXPOSE 8080
ENTRYPOINT ["/imgur-proxy"]