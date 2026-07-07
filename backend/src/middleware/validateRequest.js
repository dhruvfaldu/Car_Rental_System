import { ZodError } from "zod";
import ApiError from "../utils/ApiError.js";

const validateRequest = (schema) => async (req, res, next) => {
    try {
        const parsed = await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
        });

        if (parsed.body) {
            req.body = parsed.body;
        }

        // req.query is read-only in Express 5
        if (parsed.query) {
            Object.assign(req.query, parsed.query);
        }

        if (parsed.params) {
            Object.assign(req.params, parsed.params);
        }

        next();
    } catch (error) {
        if (error instanceof ZodError) {
            const errorMessages = error.errors
                .map((err) => `${err.path.join(".")}: ${err.message}`)
                .join(", ");

            return next(new ApiError(400, errorMessages));
        }

        next(error);
    }
};

export default validateRequest;