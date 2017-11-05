FROM node:8

ENV APP_HOME /app

WORKDIR $APP_HOME

COPY ["package.json", ".babelrc", ".eslintrc.js", ".eslintignore", "README.md", "package-lock.json", "./"]

RUN npm install

COPY ["spec", "spec"]
COPY ["src", "src"]

# Run tests
ENV NODE_ENV test
RUN npm test

# Expose port
ENV PORT 3000
EXPOSE 3000
ENV NODE_ENV production

# Run
CMD npm run server
