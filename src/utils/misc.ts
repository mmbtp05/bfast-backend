export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const isValidPhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
};

export const generateOTP = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
