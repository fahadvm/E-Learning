"use client";

import { useState } from "react";
import axios from "axios";
import { studentCourseApi } from "@/services/APIservices/studentApiservice";

export default function Home() {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("// Write your code here");
  const [output, setOutput] = useState("");

  const runCode = async () => {
    try {
      const res = await studentCourseApi.codeRunner({ language, code });
      console.log("res of output:", res)
      setOutput(res.data);
    } catch (err) {
      setOutput("Error running code");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-6">⚙️ Compiler</h1>

      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="mb-4 p-2 bg-gray-800 border border-gray-700 rounded"
      >
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
      </select>

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full max-w-3xl h-64 p-4 bg-gray-800 border border-gray-700 rounded mb-4 font-mono"
      />

      <button
        onClick={runCode}
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
      >
        ▶️ Run
      </button>

      <div className="w-full max-w-3xl mt-6">
        <h2 className="text-xl font-semibold mb-2">Output:</h2>
        <pre className="bg-gray-800 border border-gray-700 p-4 rounded whitespace-pre-wrap">
          {output}
        </pre>
      </div>
    </div>
  );
}
