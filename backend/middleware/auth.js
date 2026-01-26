// const jwt = require("jsonwebtoken");
// const { prisma } = require("@src/lib/db");
// const { sendError } = require("@src/helpers/responseHelper");

// async function requireAuth(req, res, next) {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return sendError(res, "인증 토큰이 없습니다.", 401, { code: "NO_TOKEN" });
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const user = await prisma.adminUser.findUnique({
//       where: { id: decoded.userId },
//       select: {
//         id: true,
//         username: true,
//         isActive: true,
//         isLoggedIn: true,
//       },
//     });

//     if (!user) {
//       return sendError(res, "존재하지 않는 사용자입니다.", 401, {
//         code: "USER_NOT_FOUND",
//       });
//     }

//     if (!user.isActive) {
//       return sendError(res, "비활성화된 계정입니다.", 403, {
//         code: "INACTIVE_USER",
//       });
//     }
//     req.user = user;
//     next();
//   } catch (err) {
//     return sendError(res, "토큰이 유효하지 않거나 만료되었습니다.", 401, {
//       code: "INVALID_TOKEN",
//     });
//   }
// }

// module.exports = requireAuth;
