const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return sendError(res, "인증 토큰이 필요합니다.", 401, {
        code: "REQUIRED_TOKEN",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
  }
};

const requireAuth = async (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return sendError(res, "인증 토큰이 없습니다.", 401, { code: "NO_TOKEN" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.adminUser.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        username: true,
        isActive: true,
        isLoggedIn: true,
      },
    });

    if (!user) {
      return sendError(res, "존재하지 않는 사용자입니다.", 401, {
        code: "USER_NOT_FOUND",
      });
    }

    if (!user.isActive) {
      return sendError(res, "비활성화된 계정입니다.", 403, {
        code: "INACTIVE_USER",
      });
    }
    req.user = user;
    next();
  } catch (err) {
    return sendError(res, "토큰이 유효하지 않거나 만료되었습니다.", 401, {
      code: "INVALID_TOKEN",
    });
  }
};

const authenticate = (req, res, next) => {
  const token = req.cookies.accessToken;
  try {
    const user = verifyToken(token);
    req.user = user;
    next();
  } catch (error) {
    if (error.status === 401) {
      res.clearCookie("accessToken", { path: "/" });
    }
    next(error);
  }
};

module.exports = { verifyToken, requireAuth, authenticate };
