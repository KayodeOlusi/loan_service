import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const saltRounds = 10;
class EncryptService {
  private _createToken(data: any) {
    return jwt.sign({ data }, process.env.TOKEN_ID as string, {
      expiresIn: "300000"
    });
  }

  hash(str: string) {
    return bcrypt.hashSync(str, saltRounds);
  }
  generateToken(data: any) {
    return this._createToken(data);
  }

  async compare(data: string, encrypted: string) {
    return await bcrypt.compare(data, encrypted);
  }

  verify(token: string, compare: string) {
    return jwt.verify(token, compare);
  }
}

export default EncryptService;