export interface LoginType {
    email: string;
    password: string;
}

export interface sendVerificationCodeType {
    email: string;
    subject: string;
    message?: string;
    success?: boolean
}

export interface resetPassword {
    email?: string;
    verificationCode?: string;
    newPassword: string;
    confirmNewPassword: string;
    success?: boolean;
    message?: string
}

export interface changePassword {
    currentPassword: string;
    newPassword: string;
    token?: string
}