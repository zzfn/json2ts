"use client";
import {
  ClipboardCheckIcon,
  ClipboardListIcon,
} from "@heroicons/react/outline";
import JsonToTS from "json-to-ts";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import Button from "../../components/button/Button";
import { isJson } from "../../helpers/json";
import useDebounce from "../../hooks/useDebounce";
import useLocalStorage from "../../hooks/useLocalStorage";
import Prism from "prismjs";
import "prismjs/components/prism-typescript";

Prism.manual = true;
export default function Page() {
  const [json, setJson] = useState<string>("");
  const [interfaces, setIntefaces] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [rootObjectName, setRootObjectName] = useState("");
  const { storedValue: localJson, setStorageValue: setLocalJson } =
    useLocalStorage("last-json", "");
  const { storedValue: localRootObject, setStorageValue: setLocalRootObject } =
    useLocalStorage("root-oject-name", "");

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
    if (isJson(debounceJson)) {
      setLocalJson(debounceJson);
    }
  }, [debounceJson, rootObjectName]);

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
      setLocalJson(json);
    } catch (e) {
      setIntefaces(["Enter Valid JSON"]);
    }
  }

  function getClipboardAndPaste() {
    if (!navigator.clipboard && !document.hasFocus()) {
      return;
    }
    navigator.clipboard
      .readText()
      .then((clipBoardData) => {
        setJson(clipBoardData);
      })
      .catch((e) => alert(e));
  }

  return (
    <div className="bg-black">
      <Head>
        <title>JSON 2 TS</title>
        <link rel="icon" type="image/png" href="/favicon.png"></link>
        <meta property="og:url" content="https://json2ts.vercel.app/" />
        <meta property="og:type" content="article" />
        <meta
          property="og:description"
          content="Generate Typescript Interfaces from JSON"
        />
        <meta
          property="og:image"
          content="https://json2ts.vercel.app/twitter-large-card.jpg"
        />
      </Head>
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <section className="p-6 grid grid-cols-1 gap-4 place-content-start">
          <textarea
            name="json"
            id="json"
            placeholder={"JSON"}
            className="bg-black text-white border border-gray-700 rounded w-full h-96 hide-scrollbar pl-4 py-4 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            onChange={(ev) => {
              setJson(ev.target.value);
            }}
            autoCorrect="off"
            value={json}
          />
          <input
            className="bg-black text-white border focus:border-blue-500 focus:ring-1 focus:ring-blue-500 border-gray-700 rounded w-full hide-scrollbar pl-4 py-2 outline-none"
            type="text"
            name="root"
            id="rootObject"
            value={rootObjectName}
            onChange={(e) => {
              setRootObjectName(e.target.value);
            }}
            placeholder="Root Interface Name"
          />
          <div className="flex space-y-4 flex-col items-start">
            <Button
              onClick={async () => {
                const data =
                  document.getElementById("code-interfaces")?.innerText;
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
              }}
            >
              <div className="flex space-x-2 items-center">
                <p>Copy Interfaces</p>
                {copied ? (
                  <ClipboardCheckIcon className="h-5" />
                ) : (
                  <ClipboardListIcon className="h-5" />
                )}
              </div>
            </Button>
          </div>
        </section>
        <section>
          <div className="whitespace-pre p-6 lg:h-screen overflow-y-auto text-gray-200">
            <pre>
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
                id='code-interfaces'
                className='language-typescript'
                lang={"typescript"}
              />
            </pre>
          </div>
        </section>
      </div>
    </div>
  );
}
