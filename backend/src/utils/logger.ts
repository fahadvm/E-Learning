import { createLogger, format, transports, addColors } from 'winston';

// Define custom log levels (optional)
const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'blue',
  },
};

// Apply colors
addColors(customLevels.colors);

const logger = createLogger({
  levels: customLevels.levels,
  level: 'debug',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.colorize({ all: true }), 
    format.printf(
      ({ level, message }) => ` [${level}]: ${message}`
    )
  ),
  transports: [
    new transports.Console(), 
    new transports.File({ filename: 'logs/error.log', level: 'error' }), 
    new transports.File({ filename: 'logs/combined.log' }), 
  ],
});

export default logger;
