const httpResponse = {
  json: () => {},
  sendStatus: () => {},
  status: () => {
    return {
      send() {},
    };
  },
};

export {
  httpResponse,
};
