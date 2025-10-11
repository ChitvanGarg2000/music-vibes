import type { RequestHandler, Request, Response, NextFunction } from "express";

const TryCatch = (handler: RequestHandler) : RequestHandler => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await handler(req, res, next)
        } catch (error: any) {
            console.log(error.message)
        }
    }
}

export default TryCatch