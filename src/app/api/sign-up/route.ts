import { ApiResponse } from "../../../types/ApiResponse";
import { UserModel } from "@/model/User";
import { sendVerficationEmail } from "@/helpers/sendVerificationEmail";
import VerificationEmail from "../../../../email/verficationEmail";
import dbConnect from "@/lib/dbConnect";
import bcrypt from 'bcryptjs'
import { setLazyProp } from "next/dist/server/api-utils";
import { parseAppSegmentConfig } from "next/dist/build/segment-config/app/app-segment-config";

export async function POST(request:Request){
    await dbConnect()
    try {
    const {username,email,password}=await request.json()
    const existingVerifiedUserByUsername=await UserModel.findOne({
        username,
        isVerified:true,
    }
    )
    if(existingVerifiedUserByUsername){
        return new Response(
             JSON.stringify(
                {
                    success:false,
                    message:"user name is already taken"
                }),{status:400  }
            )
    }
    const existingUserByEmail=await  UserModel.findOne({email})
    let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    if(existingUserByEmail){
        if(existingUserByEmail.isVerified){
            return new Response(
                JSON.stringify({
                    success:false,
                    message:"user already exist with this mail"
                })
            )
        }else{
            const hashedPassword=await bcrypt.hash(password,10)
            existingUserByEmail.password=hashedPassword;
            existingUserByEmail.verifyCode=verifyCode;
            existingUserByEmail.verifyCodeExpiry=new Date(Date.now()+3600000)
            await existingUserByEmail.save()
        }
        
    }else{
        const hashedPassword=await bcrypt.hash(password,10)
        const expiryDate=new Date()
        expiryDate.setHours(expiryDate.getHours()+1)

        const newUser=new UserModel({
            username,
            email,
            verifyCode,
            verifyCodeExpiry:expiryDate,
            isVerified:false,
            isAcceptingMessages:true,
            messages:[]
        })
        await newUser.save()
    }
    
    //send verification email
    const emailResponse=await sendVerficationEmail(
        username,
        email,
        verifyCode
    )
    if(!emailResponse){
        return new Response(
            JSON.stringify(
                {success:false,message: (emailResponse as any)?.message || "Email response is missing"}
            ),{status:500}
        )
    }
    return new Response(
        JSON.stringify({
          success: true,
          message: 'User registered successfully. Please verify your account.',
        }),
        { status: 201 }
      );
    } catch (error) {
        console.error("Error registering user:", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Error registering user"
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}