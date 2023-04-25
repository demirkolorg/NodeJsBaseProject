const Enum = require("../config/Enum");
const CustomError = require('./Error')

class Response {
    constructor() { }

    static successResponse(data, code = 200) {
        return {
            success: true,
            code,
            data
        }
    }

    static errorResponse(error) {
        if (error instanceof CustomError) {

            return {
                success: false,
                code: error.code,
                error: {
                    message: error.message,
                    description: error.description
                }
            }
        }

        return {
            success: false,
            code: Enum.HTTP_CODES.INTERNAL_SERVER_ERROR,
            error: {
                message: "Unknown Error!",
                description: error.message
            }
        }
    }
}

module.exports = Response;