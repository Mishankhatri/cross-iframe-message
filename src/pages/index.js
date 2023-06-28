import { Inter } from "next/font/google";
import { useEffect, useRef, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const iframeRef = useRef();

  const [dataFromChild, setDataFromChild] = useState();

  function sendMessageToChild(message) {
    const data = {
      source: "parent",
      payload: message,
    };
    iframeRef.current.contentWindow.postMessage(JSON.stringify(data), "*");
  }

  //Effect to listen for message from child
  useEffect(
    () =>
      (window.onmessage = function (e) {
        if (!e?.data) {
          return;
        }
        try {
          setDataFromChild(JSON.parse(e.data));
        } catch (err) {
          setDataFromChild("");
        }
      }),
    []
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    let formData = {
      name: e.target["name"].value,
      message: e.target["message"].value,
    };
    sendMessageToChild(formData);
    e.target.reset();
  };

  return (
    <main
      className={`flex flex-col sm:flex-row min-h-screen gap-4 items-center justify-center p-24 border-4 border-green-700  rounded-3xl border-dashed ${inter.className} `}
    >
      <form
        onSubmit={handleSubmit}
        className=" outline-4 outline-dashed outline-purple-500 rounded-2xl relative w-1/2 p-4"
      >
        <span className="left-2 -top-10 absolute text-2xl font-bold">
          Parent/Root (/)
        </span>
        <fieldset className="space-y-4">
          <div className="outline-2 outline-green-500 outline-dashed rounded-2xl text- p-4 m-2">
            <h1>Child message</h1>
            <div className="p-2">{JSON.stringify(dataFromChild)}</div>
          </div>
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

      <div className="relative">
        <span className="left-2 -top-8 absolute text-2xl font-bold">
          IFRAME(/child)
        </span>
        <iframe
          src="/child"
          ref={iframeRef}
          width={510}
          height={540}
          style={{
            background: "transparent",
            margin: 0,
            padding: 0,
            overflowX: "hidden",
          }}
        ></iframe>
      </div>
    </main>
  );
}
