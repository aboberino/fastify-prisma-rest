import crypto from 'crypto'

export function hashPassword(password: string) {

    const salt = crypto.randomBytes(16).toString('hex')

    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')

    return { salt, hash }
}

export function verifyPassword({ testingPassword, salt, hash }: { testingPassword: string, salt: string, hash: string }) {
    const testingHash = crypto.pbkdf2Sync(testingPassword, salt, 1000, 64, 'sha512').toString('hex')
    return testingHash === hash
}