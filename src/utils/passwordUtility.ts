import bcrypt from 'bcrypt';

export const hashPassword = async (password: string) => {
    const saltRound = 10
    const salt = await bcrypt.genSalt(saltRound);
    return await bcrypt.hash(password, salt);
}

export const checkPassword = async (password: string, password_hash: string) => {
    return await bcrypt.compare(password, password_hash);
}
