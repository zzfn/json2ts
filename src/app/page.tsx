"use client";
import JsonToTS from "json-to-ts";
import React, { useEffect, useState } from "react";
import useDebounce from "../../hooks/useDebounce";
import Prism from "prismjs";
import "prismjs/components/prism-typescript";

Prism.manual = true;
export default function Page() {
  const [json, setJson] = useState<string>("");
  const [interfaces, setIntefaces] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [rootObjectName, setRootObjectName] = useState("");

  const debounceJson = useDebounce(json, 500);

  const loading = json !== debounceJson;

  useEffect(() => {
    if (!copied) {
      return;
    }
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
    return () => {};
  }, [copied]);

  useEffect(() => {
    generateInterfaces();
  }, [json,rootObjectName]);

  function generateInterfaces() {
    if (!json.length) {
      setIntefaces(["Paste JSON"]);
      return;
    }
    try {
      const data = JSON.parse(json);
      let object: string[] = [];
      JsonToTS(data, {
        rootName: rootObjectName.length ? rootObjectName : "RootObject",
      }).forEach((typeInterface) => {
        object.push(typeInterface);
      });
      setIntefaces(object);
    } catch (e) {
      setIntefaces(["Enter Valid JSON"]);
    }
  }

  async function handleCopy() {
    const data = document.getElementById("code-interfaces")?.innerText;
    if (data) {
      if (!navigator.clipboard && !document.hasFocus()) {
        return;
      }
      await navigator.clipboard.writeText(data ?? "").then(
        function () {
          setCopied(true);
          console.log("Copied Success");
        },
        function (err) {
          alert(err);
        },
      );
    }
  }

  return (
    <div className="grid grid-cols-2 gap-x-10 py-10 gap-y-10">
      <input
        className="border focus:border-blue-500 focus:ring-1 focus:ring-blue-500 border-gray-700 rounded w-full hide-scrollbar pl-4 py-2 outline-none"
        type="text"
        name="root"
        id="rootObject"
        value={rootObjectName}
        onChange={(e) => {
          setRootObjectName(e.target.value);
        }}
        placeholder="Root Interface Name"
      />
      <button
        className="px-4 py-2 font-semibold text-sm bg-cyan-500 text-white rounded-full shadow-sm hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-cyan-200"
        onClick={handleCopy}
      >
        Copy
      </button>
      <textarea
        name="json"
        id="json"
        placeholder="JSON"
        className="border border-gray-700 rounded w-full h-96 hide-scrollbar pl-4 py-4 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        onChange={(ev) => {
          setJson(ev.target.value);
        }}
        autoCorrect="off"
        value={json}
      />
      <pre className="whitespace-pre overflow-y-auto border p-6">
        <code
          dangerouslySetInnerHTML={{
            __html: loading
              ? `// Loading... \n\n`
              : Prism.highlight(
                  interfaces
                    .map((int) => "export " + int)
                    .join("\n\n")
                    .trim(),
                  Prism.languages["typescript"],
                  "typescript",
                ),
          }}
          id="code-interfaces"
          className="language-typescript font-mono"
          lang={"typescript"}
        />
      </pre>
    </div>
  );
}
