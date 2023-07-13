((global) => {
  const propSubscribers = [];

  global.addEventListener("message", (event) => {
    global.appsmith.props = event.data.props;
    
    propSubscribers.forEach((fn) => {
      if (event.source === global.parent) {
        fn(event.data.props);
      }
    });
  });

  global.appsmith = {
    onPropsChange: (fn) => {
      propSubscribers.push(fn);
    },
    upateProps: (obj) => {
      global.parent.postMessage({
        type: "update",
        data: obj
      });
    },
    triggerEvent: (eventName, eventString) => {
      global.parent.postMessage({
        type: "event",
        data: {
          eventName,
          eventString
        }
      });
    },
    props: {}
  };
})(window);
