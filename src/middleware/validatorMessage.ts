import { isCelebrateError } from 'celebrate'
import { Request, Response, NextFunction } from 'express'
const HandleErrorMessage = async (err: any, req: Request, res: Response, next: NextFunction) => {

    try {
        if (isCelebrateError(err)) {
            let errorBody: any = {}
            if (err.details.get('body')) {
                errorBody = err.details.get('body');
            } else if (err.details.get('query')) {
                errorBody = err.details.get('query');
            } else if (err.details.get('headers')) {
                errorBody = err.details.get('headers');
            }
            return res.status(400).send({ status: false, message: errorBody.details[0].message });
        }
    } catch (e:any) {
        return res.status(400).send({ status: false, message: e.message })
    }
}

export default HandleErrorMessage

