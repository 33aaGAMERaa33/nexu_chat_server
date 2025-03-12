import { IsIn, IsInt, IsString } from "class-validator";

export class CreateContactDto{
    @IsInt()
    sender_id: number;
    @IsInt()
    receiver_id: number;
}