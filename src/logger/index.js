import winston from 'winston';

export default ({ config }) => {
  const level = config.get('LOGGER:LEVEL');
  const isDisabled = !!config.get('LOGGER:IS_DISABLED');
  const transports = [];
  const exceptionHandlers = [];
  let logger;

  if (isDisabled) {
    logger = new winston.Logger();
    console.log('\u001b[32minfo\u001b[39m: [logger] is disabled by configuration');
  } else {
    transports.push(
      new winston.transports.Console({
        level,
        json: false,
        timestamp: true,
        colorize: true,
      }),
    );

    exceptionHandlers.push(
      new winston.transports.Console({
        level,
        json: false,
        timestamp: true,
        colorize: true,
        silent: false,
        prettyPrint: true,
      }),
    );

    logger = new winston.Logger({
      transports,
      exceptionHandlers,
      exitOnError: false,
    });

    logger.info('[logger] initialized with [%s] level', level);
  }

  return logger;
};
