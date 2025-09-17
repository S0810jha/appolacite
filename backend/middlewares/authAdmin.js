import jwt from "jsonwebtoken";

// admin authantication middleware

const authAdmin = async (req, res, next) => {
  try {
    const { atoken } = req.headers;
    if (!atoken) {
      return res.json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const decoded_token = jwt.verify(atoken, process.env.JWT_SECRET);

    if (
      decoded_token !==
      process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD
    ) {
      return res.json({
        success: false,
        message: "Unauthorized access",
      });
    }

    next();
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export default authAdmin;
