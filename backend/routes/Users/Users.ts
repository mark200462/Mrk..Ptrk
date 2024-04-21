import { PrismaClient, Users } from "@prisma/client";
import express, { Router, Request, Response } from "express";
import bcrypt from 'bcrypt';
import jwt, { Secret } from 'jsonwebtoken';
import * as dotenv from 'dotenv'
dotenv.config()

module.exports = (): Router => {
    const router: Router = express.Router();
    const prisma: PrismaClient = new PrismaClient();

    async function isEmailTaken(email: string){
        const user = await prisma.users.findUnique({
            where: {
              Email: email,
            },
        });
          
        return user !== null;
    }

    router.post('/create', async (req: Request, res: Response) => {
        try {
            if (await isEmailTaken(req.body.email)){
                return res.status(500).json({message: "takenEmail"})
            }

            const user: Users = await prisma.users.create({
                data: {
                    Email: req.body.email,
                    Password: `${await bcrypt.hash(req.body.password, 8)}`,
                }
            })
            return res.status(200).send({message: 'Success'})
        } catch(error: any) {
            return res.status(500).json({message: error.message})
        }
    })

    router.post('/login', async (req: Request, res: Response) => {
        try {
            const user = await prisma.users.findUnique({
                where: {
                  Email: req.body.email,
                },
                select: {
                    Password: true,
                    ID: true,
                }
            });

            if(user === null){
                return res.status(401).send({message: "credError"})
            }

            if(!(await bcrypt.compare(req.body.password, user.Password))){
                return res.status(401).send({message: "credError"})
            }

            let LoginToken = jwt.sign({ID: user.ID}, process.env.JWT_TOKEN as Secret);
            res.cookie('UserToken', LoginToken, {httpOnly: false, maxAge: 31556952000, sameSite: "strict"})

            return res.status(200).send({message: "Success"})
        } catch(error: any) {
            return res.status(500).json({message: error.message})
        }
    })

    router.post('/logout', async (req: Request, res: Response) => {
        try {
            if(req.cookies.UserToken === undefined){
                return res.status(401).send({message: "NoToken"}) 
            }
            res.clearCookie("UserToken")
            return res.status(200).send({message: "Success"})
        } catch(error: any) {
            return res.status(500).json({message: error.message})
        }
    })

    router.get("/userData", async (req: Request, res: Response) => {
        try {
            if(req.cookies.UserToken === undefined){
                return res.status(401).send({}) 
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
                    AdminLevel: true,
                }
            });

            if(user === null){
                return res.status(401).send({})
            }

            return res.status(200).send({message: "Success", payload: user})
        } catch(error: any) {
            return res.status(500).json({message: error.message})
        }
    })

    router.post("/getUser", async (req: Request, res: Response) => {
        try {
            if(req.cookies.UserToken === undefined){
                return res.status(401).send({message: "toLogin"}) 
            }       

            interface jwtPayload {
                ID: number
            }
            const jwtData = jwt.verify(req.cookies.UserToken, process.env.JWT_TOKEN as Secret) as jwtPayload

            const OriginUser = await prisma.users.findUnique({
                where: {
                  ID: jwtData.ID,
                }
            });

            if(OriginUser === null){
                return res.status(401).send({message: "toLogin"})
            }

            if(OriginUser.AdminLevel < 2){
                return res.status(401).send({message: "toDashboard"})
            }

            const user = await prisma.users.findUnique({
                where: {
                  Email: req.body.email,
                }
            });

            if(user === null){
                return res.status(404).send({})
            }

            return res.status(200).send({message: "Success", payload: user})
        } catch(error: any) {
            return res.status(500).json({message: error.message})
        }
    })

    router.put("/changeAdminLevel", async (req: Request, res: Response) => {
        try {
            if(req.cookies.UserToken === undefined){
                return res.status(401).send({message: "toLogin"}) 
            }       

            interface jwtPayload {
                ID: number
            }
            const jwtData = jwt.verify(req.cookies.UserToken, process.env.JWT_TOKEN as Secret) as jwtPayload

            const OriginUser = await prisma.users.findUnique({
                where: {
                  ID: jwtData.ID,
                }
            });

            if(OriginUser === null){
                return res.status(401).send({message: "toLogin"})
            }

            if(OriginUser.AdminLevel < 2){
                return res.status(401).send({message: "toDashboard"})
            }

            const user = await prisma.users.findUnique({
                where: {
                  Email: req.body.email,
                }
            });

            if(user === null){
                return res.status(404).send({})
            }
            /*
            if(user.AdminLevel > OriginUser.AdminLevel) {
                return res.status(401).send({})
            }
            */

            const update = await prisma.users.update({
                where: {
                    ID: user.ID
                },
                data: {
                    AdminLevel: req.body.adminlevel
                }
            })

            const AdminNames = ["Felhasználó", "Adminisztrátor", "Tulajdonos"]

            await prisma.notification.create({
                data: {
                    Description: "Módosították az adminisztrátori jogkörödet! ("+AdminNames[user.AdminLevel]+" -> "+AdminNames[update.AdminLevel]+")",
                    Owner: {
                        connect: {ID: user.ID}
                    }
                }
            })

            if(OriginUser.ID === user.ID){
                return res.status(200).send({message: "Refresh"})
            }else{
                return res.status(200).send({message: "Success"})
            }
        } catch(error: any) {
            return res.status(500).json({message: error.message})
        }
    })

    router.get('/validate', async (req: Request, res: Response) => {
        try {
            if(req.cookies.UserToken === undefined){
                return res.status(401).send({message: "toLogin"}) 
            }       

            interface jwtPayload {
                ID: number
            }
            const jwtData = jwt.verify(req.cookies.UserToken, process.env.JWT_TOKEN as Secret) as jwtPayload

            return res.status(401).send({message: "toDashboard"}) 
            
        } catch(error: any) {
            return res.status(500).json({message: error.message})
        }
    })

    return router;
}