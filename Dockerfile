FROM node:8

ENV APP_HOME /app

# Install requirements for yarn
RUN apt-get update && apt-get install -y apt-transport-https

# Install yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update && apt-get install -y yarn

WORKDIR $APP_HOME

COPY ["package.json", ".babelrc", ".eslintrc.js", ".eslintignore", "README.md", "yarn.lock", "./"]

RUN yarn install

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
