import { useEffect, useState } from "react";

const Child = () => {
  const [dataFromParent, setDataFromParent] = useState();

  function sendMessageToParent(message) {
    const data = {
      source: "child",
      payload: message,
    };
    window.parent.postMessage(JSON.stringify(data), "*");
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    let formData = {
      name: e.target["name"].value,
      message: e.target["message"].value,
    };
    sendMessageToParent(formData);
    e.target.reset();
  };

  //Effect to listen for message from parent
  useEffect(
    () =>
      (window.onmessage = function (e) {
        if (!e?.data) {
          return;
        }
        try {
          setDataFromParent(JSON.parse(e.data));
        } catch (err) {
          setDataFromParent("");
        }
      }),
    []
  );
  return (
    <div className="rounded-3xl w-full h-full p-4 bg-transparent bg-yellow-200 border-4 border-red-700 border-dashed shadow-none">
      <div className="outline-2 outline-green-500 outline-dashed rounded-2xl text- p-4 m-2">
        <h1> Parent message</h1>
        <div className="p-2">{JSON.stringify(dataFromParent)}</div>
      </div>

      <form onSubmit={handleSubmit}>
        <fieldset className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label htmlFor="fname">Name</label>
            <input type="text" id="name" name="name" />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" />
          </div>
          <button
            className="px-5 py-2 border border-purple-500 rounded-lg"
            type="submit"
          >
            Submit
          </button>
        </fieldset>
      </form>
    </div>
  );
};

export default Child;
