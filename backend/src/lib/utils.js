import JWT from "jsonwebtoken";

export const generateToken = (userid, res) => {
  const { JWT_SECRET } = process.env;
  if (!JWT_SECRET) throw new Error("jwt secret is not set");
  const token = JWT.sign({ userid }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, //milliseconds
    httpOnly: true, //prevents xss attacks
    sameSite: "strict", //prevents crsf attacks
    secure: (process.env.NODE_ENV = "development" ? false : true),
  });

  return token;
};

export default generateToken;
