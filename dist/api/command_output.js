import { config } from "../config.js";
export function logRequests(req, res) {
    res.send(`Hits: ${config.fileServerHits}`);
}
export function requestsReset(req, res) {
    console.log("Reached this function");
    config.fileServerHits = 0;
    res.send(`Hits: ${config.fileServerHits}`);
}
export function adminLogRequests(req, res) {
    res.set({
        'Content-Type': 'text/html; charset=utf-8',
    });
    res.send(`<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${config.fileServerHits} times!</p>
  </body>
</html>
`);
}
