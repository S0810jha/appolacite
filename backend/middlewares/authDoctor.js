import jwt from "jsonwebtoken";

// doctor authantication middleware

const authDoctor = async (req, res, next) => {
  try {
    const { dtoken } = req.headers;
    if (!dtoken) {
      return res.json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const decoded_token = jwt.verify(dtoken, process.env.JWT_SECRET);
    req.docId = decoded_token.id;
    next();
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export default authDoctor;
