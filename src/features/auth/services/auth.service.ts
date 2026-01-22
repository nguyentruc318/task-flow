import { http } from "@/lib/http-client";
import { LoginSchema, RegisterSchema } from "../schemas/auth.schema";
const authApiRequest = {
  login: (body: LoginSchema) => http.post("/auth/login", body),
  register: (body: RegisterSchema) => http.post("/auth/register", body),
};
export default authApiRequest;
