import * as crypto from "crypto";

export function IdGenerator(){
    return crypto.randomBytes(16).toString("base64")
}