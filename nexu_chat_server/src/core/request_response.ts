import { RequestCODES } from "./request_codes";

export class RequestResponse{
    status: string = "error";
    message: any = RequestCODES.defaultERROR;
}