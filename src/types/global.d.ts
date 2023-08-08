export const thisIsAModule = true;

declare global {
    var config: any;
    namespace Express {
        interface Request {
            token: string,
            user: any,
            header: any
        }
    }
}
