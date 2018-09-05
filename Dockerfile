FROM node:10-alpine as builder

COPY ["package.json", ".babelrc", ".eslintrc.js", ".eslintignore", "README.md", "package-lock.json", "./"]
COPY ["spec", "spec"]
COPY ["src", "src"]

RUN npm install
RUN npm run build

RUN rm -rf node_modules
ENV NODE_ENV production
RUN npm install


FROM node:10-alpine

COPY --from=builder /app ./app
COPY --from=builder /package.json ./package.json
COPY --from=builder /node_modules ./node_modules

# Expose port
ENV PORT 3000
EXPOSE 3000
ENV NODE_ENV production

# Run
CMD npm run server
