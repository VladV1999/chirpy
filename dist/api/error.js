import { respondWithError } from "./json.js";
export class BadRequestError extends Error {
    constructor(message) {
        super(message);
    }
}
export class UserNotAuthenticatedError extends Error {
    constructor(message) {
        super(message);
    }
}
export class UserForbiddenError extends Error {
    constructor(message) {
        super(message);
    }
}
export class NotFoundError extends Error {
    constructor(message) {
        super(message);
    }
}
export function middlewareHandlerError(err, req, res, next) {
    let statusCode = 500;
    let message = "Something went wrong on our end";
    if (err instanceof BadRequestError) {
        statusCode = 400;
        message = err.message;
    }
    else if (err instanceof UserNotAuthenticatedError) {
        statusCode = 401;
        message = err.message;
    }
    else if (err instanceof UserForbiddenError) {
        statusCode = 403;
        message = err.message;
    }
    else if (err instanceof NotFoundError) {
        statusCode = 404;
        message = err.message;
    }
    if (statusCode >= 500) {
        console.log(err.message);
    }
    respondWithError(res, statusCode, message);
}
