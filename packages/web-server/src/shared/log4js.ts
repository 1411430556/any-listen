import path from 'node:path'
import log4js from 'log4js'

const buildLogConfig = (logPath: string) => {
  return {
    appenders: {
      access: {
        type: 'dateFile',
        filename: path.join(logPath, 'access.log'),
        pattern: '-yyyy-MM-dd',
        category: 'http',
        compress: true,
        keepFileExt: true,
        numBackups: 90,
      },
      app: {
        type: 'file',
        filename: path.join(logPath, 'app.log'),
        maxLogSize: 10485760,
        compress: true,
        backups: 3,
        keepFileExt: true,
      },
      extension: {
        type: 'file',
        filename: path.join(logPath, 'extension.log'),
        maxLogSize: 10485760,
        compress: true,
        category: 'extension',
        backups: 3,
        keepFileExt: true,
      },
      errorFile: {
        type: 'file',
        filename: path.join(logPath, 'errors.log'),
      },
      errors: {
        type: 'logLevelFilter',
        level: 'ERROR',
        appender: 'errorFile',
      },
      console: {
        type: 'console',
      },
    },
    categories: {
      default: { appenders: ['app', 'errors', 'console'], level: 'DEBUG' },
      http: { appenders: ['access'], level: 'ALL' },
      extension: { appenders: ['extension'], level: 'DEBUG' },
    },
  }
}

export const initLogger = (logPath: string) => {
  log4js.configure(buildLogConfig(logPath))
}

export const startupLog = log4js.getLogger('startup')
export const httpLog = log4js.getLogger('http')
export const appLog = log4js.getLogger('app')
export const extensionLog = log4js.getLogger('extension')
