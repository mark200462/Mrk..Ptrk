import { Prisma, PrismaClient } from "@prisma/client";
import express, { Router, Request, Response } from "express";
import bcrypt from 'bcrypt';
import jwt, { Secret } from 'jsonwebtoken';
import * as dotenv from 'dotenv'
dotenv.config()

module.exports = (): Router => {
    const router: Router = express.Router();
    const prisma: PrismaClient = new PrismaClient();

    router.get("/get", async (req: Request, res: Response) => {
        try {
            if(req.cookies.UserToken === undefined){
                return res.status(401).send({message: "toLogin"}) 
            }

            interface jwtPayload {
                ID: number
            }
            const jwtData = jwt.verify(req.cookies.UserToken, process.env.JWT_TOKEN as Secret) as jwtPayload
            const user = await prisma.users.findUnique({
                where: {
                  ID: jwtData.ID,
                },
                select: {
                    Notifications: {
                        orderBy: {
                            Time: 'desc'
                        }
                    }
                }
            });

            if(user === null){
                return res.status(401).send({message: "toLogin"})
            }

            return res.status(200).send({message: "Success", payload: user})
        } catch(error: any) {
            return res.status(500).json({message: error.message})
        }
    })

    router.delete("/delete", async (req: Request, res: Response) => {
        try {
            if(req.cookies.UserToken === undefined){
                return res.status(401).send({message: "toLogin"}) 
            }

            interface jwtPayload {
                ID: number
            }
            const jwtData = jwt.verify(req.cookies.UserToken, process.env.JWT_TOKEN as Secret) as jwtPayload
            await prisma.notification.delete({
                where: {
                    ID: req.body.ID ,
                    Owner: { ID: jwtData.ID }
                }
            })
            return res.status(200).send({message: "Success"})
        } catch(error: any) {
            console.log(error.message)
            return res.status(500).json({message: error.message})
        }
    })

    return router;
}