import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const saltRounds = 10;
class EncryptService {
  private _createToken(data: any) {
    return jwt.sign({ ...data }, process.env.TOKEN_ID as string, {
      expiresIn: "30m"
    });
  }

  hash(str: string) {
    return bcrypt.hashSync(str, saltRounds);
  }
  generateJWT(data: any) {
    return this._createToken(data);
  }

  async compare(data: string, encrypted: string) {
    return await bcrypt.compare(data, encrypted);
  }


  verifyJWT(token: string, compare: string) {
    return jwt.verify(token, compare);
  }
}

export default EncryptService;