import createError from "http-errors";
import swaggerUi from "swagger-ui-express";
import { SWAGGER_PATH  } from "../constants/index.js";
import { readFileSync } from 'node:fs';

export const swaggerDocs = () => {
try {
    const swaggerDocs = JSON.parse(readFileSync(SWAGGER_PATH, "utf-8"));
    return [...swaggerUi.serve, swaggerUi.setup(swaggerDocs)];
} catch (error) {
    return (req, res, next) => {
        next(createError(500, error.message));
    };
}
};
