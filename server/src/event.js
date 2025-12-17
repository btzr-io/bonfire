const CLIENT_EVENT = {};

const EVENT = {
  member_added: ({ channel, user_id }) => {
    console.log("Player ", user_id, " joined: ", channel);
  },
  member_removed: ({ channel, user_id }) => {
    console.log("Player ", user_id, " disconnected: ", channel);
  },
  client_event: ({ channel, event: eventName, data, user_id, socket_id }) => {
    console.log(eventName, channel);
    const callback = CLIENT_EVENT[eventName];
    if (callback) return callback({ data, channel, user_id, socket_id });
  },
};


export const handleEvents = async (events) => {
  if (events && events.length) {
    for (let eventIndex in events) {
      const { name, ...data } = events[eventIndex];
      const callback = EVENT[name];
      if (callback) {
        return await callback(data);
      }
    }
  }
};
