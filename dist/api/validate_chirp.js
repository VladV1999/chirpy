export async function handlerChirpsValidate(req, res) {
    const params = req.body;
    const maxLength = 140;
    if (!(Object.hasOwn(params, "body"))) {
        res.status(400).send({
            "error": "Invalid JSON",
        });
    }
    if (params.body.length > maxLength) {
        res.status(400).send({
            "error": "Chirp is too long",
        });
    }
    res.status(200).send({
        "valid": true
    });
}
