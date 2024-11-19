import {resend} from '@/lib/resend'
import VerificationEmail from '../../email/verficationEmail'
import { ApiResponse } from '@/types/ApiResponse'

export async function sendVerficationEmail(
    email:string,
    username:string,
    verifyCode:string,
):Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from:'onboarding@ressend.com',
            to:email,
            subject:"mystery message verfication code",
            react:VerificationEmail({username,otp:verifyCode})
        })
        return { success: true, message: 'Verification email sent successfully.' };

    } catch (emailError) {
        console.log('Error sending email verification:',emailError)
        return {success:false,message:"failed to send verification email"}
    }
}