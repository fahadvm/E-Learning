"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const db_1 = __importDefault(require("./config/db"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const companyRoutes_1 = __importDefault(require("./routes/companyRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const studentAuthRoutes_1 = __importDefault(require("./routes/studentAuthRoutes"));
const employeeRoutes_1 = __importDefault(require("./routes/employeeRoutes"));
const teacherAuthRoutes_1 = __importDefault(require("./routes/teacherAuthRoutes"));
const errorHandler_1 = require("./middleware/errorHandler");
require("./config/passport");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, morgan_1.default)('tiny', {
    stream: {
        write: (message) => console.log(message.trim())
    }
}));
app.use((0, express_session_1.default)({ secret: 'your_secret', resave: false, saveUninitialized: false }));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
const allowedOrigins = [
    'http://localhost:3000',
    /\.devtunnels\.ms$/,
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.some((o) => typeof o === 'string' ? o === origin : o.test(origin))) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use('/api/company', companyRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
app.use('/api/student', studentAuthRoutes_1.default);
app.use('/api/teacher', teacherAuthRoutes_1.default);
app.use("/employee", employeeRoutes_1.default);
app.use(errorHandler_1.errorHandler);
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
(0, db_1.default)();
