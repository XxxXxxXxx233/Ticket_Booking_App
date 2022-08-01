import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

class Password {
    
    static async toHash(password: string) {
        const salt = randomBytes(8).toString('hex');
        const buf = (await scryptAsync(password, salt, 64)) as Buffer;
        return `${buf.toString('hex')}.${salt}`;
    }

    static async compare(target: string, input: string) {
        const [hashed, salt] = target.split('.');
        const buf = (await scryptAsync(input, salt, 64)) as Buffer;
        return buf.toString('hex') === hashed;
    }
}

export { Password };