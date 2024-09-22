import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { asClass } from 'awilix';

export const AuthModule = {
    authService: asClass(AuthService).singleton(),
    authController: asClass(AuthController).singleton(),
}