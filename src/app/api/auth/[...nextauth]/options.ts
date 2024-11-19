import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/User";
import { error } from "console";
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs'
export const authOptions = {
    providers:[
        CredentialsProvider({
            id:'credentials',
            name:"credentials",
            credentials:{
                email:{label:"Email",type:"email"},
                password:{label:"password",type:"password"}
            },
            async authorize(credentials:any, req:any) {
                await dbConnect()
                try {
                    const user=await UserModel.findOne({
                        $or:[
                            {email:credentials.identifier},
                            {username:credentials.identifier}
                        ]
                    })
                    if(!user)throw new Error("no user with this email find")
                    if(!user.isVerified)throw new Error("please verify before logging in ")

                    const isPasswordCorrect=await bcrypt.compare(credentials.password,user.password)
                    if (isPasswordCorrect) {
                        return user;
                      } else {
                        throw new Error('Incorrect password');
                      }
                } catch (err:any) {
                    throw new Error(err)
                }
                
            },
        })
    ]
}