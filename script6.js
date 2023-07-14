((global) => {
  const propSubscribers = [];
  let onReady;

  global.addEventListener("message", (event) => {
    global.appsmith.props = event.data.props || {};
    if (event.data.type === "ready") {
      onReady && onReady();
    } else {
      propSubscribers.forEach((fn) => {
        if (event.source === global.parent) {
          fn(event.data.props);
        }
      });
    }
  });

  global.appsmith = {
    onPropsChange: (fn) => {
      propSubscribers.push(fn);
    },
    updateProps: (obj) => {
      global.parent.postMessage({
        type: "update",
        data: obj
      }, "*");
    },
    triggerEvent: (eventName, eventString) => {
       global.parent.postMessage({
        type: "event",
        data: {
          eventName,
          eventString
        }
      }, "*");
    },
    props: {},
    onReady: (fn) => {
      onReady = fn;
    }
  };
})(window);
