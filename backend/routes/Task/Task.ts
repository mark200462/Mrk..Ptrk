import { Prisma, PrismaClient } from "@prisma/client";
import express, { Router, Request, Response } from "express";
import bcrypt from 'bcrypt';
import jwt, { Secret } from 'jsonwebtoken';
import * as dotenv from 'dotenv'
dotenv.config()

module.exports = (): Router => {
    const router: Router = express.Router();
    const prisma: PrismaClient = new PrismaClient();

    router.post("/getUserTask", async (req: Request, res: Response) => {
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

            if(OriginUser.AdminLevel < 1){
                return res.status(401).send({message: "toDashboard"})
            }

            const user = await prisma.users.findUnique({
                select: {
                    Tasks: {
                        orderBy: {
                            Time: "asc"
                        }
                    },
                },
                where: {
                  Email: req.body.email,
                },
                

            });
            
            if(user === null){
                return res.status(404).send({message: "noUser"})
            }

            return res.status(200).send({message: "Success", payload: user?.Tasks})
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

            const OriginUser = await prisma.users.findUnique({
                where: {
                  ID: jwtData.ID,
                }
            });

            if(OriginUser === null){
                return res.status(401).send({message: "toLogin"})
            }

            if(OriginUser.AdminLevel < 1){
                return res.status(401).send({message: "toDashboard"})
            }

            const task = await prisma.task.delete({
                where: {
                    ID: req.body.ID
                }
            })

            await prisma.notification.create({
                data: {
                    Description: "Eltávolítatták egy feladatodat! ("+task.Name+")",
                    Owner: {
                        connect: {ID: task.OwnerId}
                    }
                }
            })

            return res.status(200).send({message: "Success"})
        } catch(error: any) {
            return res.status(500).json({message: error.message})
        }
    })

    router.put("/edit", async (req: Request, res: Response) => {
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

            if(OriginUser.AdminLevel < 1){
                return res.status(401).send({message: "toDashboard"})
            }

            const task = await prisma.task.update({
                where: {
                    ID: req.body.ID
                },
                data: {
                    Time: req.body.Time,
                    Name: req.body.Name
                }
            })

            await prisma.notification.create({
                data: {
                    Description: "Módosították egy feladatodat! ("+task.Name+")",
                    Owner: {
                        connect: {ID: task.OwnerId}
                    }
                }
            })

            return res.status(200).send({message: "Success"})
        } catch(error: any) {
            return res.status(500).json({message: error.message})
        }
    })
  
    router.post("/create", async (req: Request, res: Response) => {
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

            if(OriginUser.AdminLevel < 1){
                return res.status(401).send({message: "toDashboard"})
            }

            const user = await prisma.users.findUnique({
                where: {
                  Email: req.body.email,
                }
            });


            if(user === null){
                return res.status(404).send({message: "noUser"})
            }

            const task = await prisma.task.create({
                data: {
                    Name: req.body.name,
                    Time: req.body.time,
                    Owner: {
                        connect: { ID: user.ID }
                    },
                }
            });

            await prisma.notification.create({
                data: {
                    Description: "Létrehoztak egy feladatot számodra! ("+task.Name+")",
                    Owner: {
                        connect: {ID: task.OwnerId}
                    }
                }
            })

            return res.status(200).send({message: "Success"})
        } catch(error: any) {
            return res.status(500).json({message: error.message})
        }
    })

    router.post("/getOwnDay", async (req: Request, res: Response) => {
        try {
            if(req.cookies.UserToken === undefined){
                return res.status(401).send({message: "toLogin"}) 
            }

            interface jwtPayload {
                ID: number
            }
            const jwtData = jwt.verify(req.cookies.UserToken, process.env.JWT_TOKEN as Secret) as jwtPayload
            let start = new Date(req.body.Time)
            start.setUTCHours(0,0,0,0)
            let end = new Date(req.body.Time)
            end.setUTCHours(23,59,59,59)
            const user = await prisma.users.findUnique({
                where: {
                  ID: jwtData.ID,
                },
                select: {
                    Tasks: {
                        orderBy: {
                            Time: 'asc'
                        },
                        where: {
                            Time: {
                                gte: start,
                                lte: end
                            }
                        }
                    }
                }
            });

            if(user === null){
                return res.status(401).send({message: "toLogin"})
            }

            return res.status(200).send({message: "Success", payload: user})
        } catch(error: any) {
            console.log(error.message)
            return res.status(500).json({message: error.message})
        }
    })

    return router;
}