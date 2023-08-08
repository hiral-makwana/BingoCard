import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'



const userAuth = async (req: Request, res: Response, next: NextFunction) => {

    try {
        // checking if token is present in header
        if (!req.headers.authorization) {
            return res.status(400).send({ status: false, message: res.__('ERROR_TOKEN_REQUIRED') })
        }
        // removing Bearer keyword
        const token: string = req.headers.authorization?.replace('Bearer', '').trim()

        // verifying token
        const decoded: any = jwt.verify(token, global.config.JWT_SECRET, { ignoreExpiration: true })

        // finding user with details decoded fro token
        // let UserData: any = await User.findOne({ where: { id: decoded.id, email: decoded.email }, raw: true })

        // if (!UserData) {
        //     return res.status(400).send({ status: false, message: res.__('ERROR_INVALID_TOKEN') })
        // }

        // setting req.user to user found from token and req.token to token
        req.token = token
        req.user = decoded
        next()
    } catch (e: any) {
        console.log(e)
        if (e.message == 'jwt malformed') {
            return res.status(400).send({ status: false, message: res.__('ERROR_INVALID_TOKEN') })
        } else {
            return res.status(400).send({ status: false, message: e.message })
        }
    }
}

export default userAuth
