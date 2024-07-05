"use client";

import { useEffect, useState } from "react";
import Editor from "../../../components/Editor";

export default function Page({ params }) {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");
  const [editorData, setEditorData] = useState("");

  async function fetchUpdatedPageData() {
    const pageID = params.pageid;
    try {
      const response = await fetch(`http://localhost:4000/pages/${pageID}`, {
        credentials: "include",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const updatedPageData = await response.json();
      console.log("Updated page data after save: ", updatedPageData);
      setPage(updatedPageData);
      setTitle(updatedPageData.title);
      setEditorData(updatedPageData.editorData);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch updated page data: ", error);
    }
  }

  useEffect(() => {
    fetchUpdatedPageData();
  }, [params.pageid]);

  const handleTitleBlur = async (event) => {
    const newTitle = event.target.innerText;
    setTitle(newTitle);

    try {
      await fetch(`http://localhost:4000/pages/${params.pageid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newTitle }),
      });
    } catch (error) {
      console.error("Error saving title:", error);
      setError(error);
    }
  };

  const handlePageSave = async (title, editorData) => {
    console.log("editorData in handle Page save: ", editorData);
    const pageId = params.pageid;
    const content = editorData;

    try {
      console.log("Saving page... - before call to backend ");
      await fetch(`http://localhost:4000/pages/${pageId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });
      console.log("Page saved!");
    } catch (error) {
      console.error("Error saving block:", error);
      setError(error);
    }
  };

  if (loading) return <div className="text-white">Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="p-16">
      <h1
        contentEditable={true}
        className="m-10 text-neutral-100"
        suppressContentEditableWarning={true}
        onBlur={handleTitleBlur}
      >
        {page.title}
      </h1>
      <div>
        <Editor
          initialData={editorData}
          onSave={(editorDocument) =>
            handlePageSave(page.title, editorDocument)
          }
        />
      </div>
    </div>
  );
}
