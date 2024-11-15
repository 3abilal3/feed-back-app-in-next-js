import { z } from "zod";

export const messageSchema = z.object({
    content:z
    .string()
    .min(20,{message:'Content must be atleast 10 characters '})
    .max(300,"Content must be nop more then  300 characters ")
})