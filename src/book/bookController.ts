import {Request, Response, NextFunction } from "express-serve-static-core";

const  createBook = async(
     //data we received from req body 
     // we will receive data in different forn that is (form-data) not json data

    req: Request,
    res: Response,
    next: NextFunction,
   
) =>{
     const {} = req.body;
res.json({});
};
export {createBook};