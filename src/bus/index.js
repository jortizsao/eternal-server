import events from 'events';

module.exports = () => {
  const bus = {};
  const eventEmitter = new events.EventEmitter();

  bus.publish = (channel, data) => {
    eventEmitter.emit(channel, data);
  };

  bus.subscribe = (channel, handler) => {
    eventEmitter.on(channel, handler);
  };

  bus.send = (channel, data) => {
    eventEmitter.emit(channel, data);
  };

  bus.listen = (channel, handler) => {
    eventEmitter.on(channel, handler);
  };

  return bus;
};
