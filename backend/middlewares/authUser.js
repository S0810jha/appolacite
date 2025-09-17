import jwt from "jsonwebtoken";

// user authantication middleware

const authUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.json({
        success: false,
        message: "Unauthorized access",
      });
    }
    const token = authHeader.split(" ")[1];

    const decoded_token = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded_token.id;
    next();
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export default authUser;
