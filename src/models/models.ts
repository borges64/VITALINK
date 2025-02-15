export interface IUser {
    name: string;
    email: string;
    password: string;
    type?: Role; // Opcional, padrão será USER
    cpf?: string;
    address?: string;
    phone?: string;
    birthDate?: Date;
    moreInfo?: string;
  }

export enum Role {
    ADMIN = "ADMIN",
    USER = "USER",
    PATIENT = "PATIENT",
    MEDIC = "MEDIC",
    ASSISTENT = "ASSISTENT"
  }
  

