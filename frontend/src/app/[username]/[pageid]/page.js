"use client";

import { useEffect, useState } from "react";
import Editor from "../../../components/Editor";

export default function Page({ params }) {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getPage = async () => {
      try {
        console.log("fetch pages");
        const pageID = params.pageid;
        console.log(pageID);
        const response = await fetch(`http://localhost:4000/pages/${pageID}`, {
          credentials: "include",
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const page = await response.json();

        setPage(page);
      } catch (error) {
        console.error("Error fetching page:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    getPage();
  }, [params.pageid]);

  const handlePageSave = async (title, content) => {
    try {
      await fetch(`http://localhost:4000/pages/${params.pageid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });

      // Refresh the page data after saving
      const updatedPage = await fetch(
        `http://localhost:4000/pages/${params.pageid}`
      );
      const updatedPageData = await updatedPage.json();
      setPage(updatedPageData);
    } catch (error) {
      console.error("Error saving block:", error);
      setError(error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  console.log("page", page);

  return (
    <div className="p-16">
      <h1 contentEditable={true} className="m-10 text-neutral-100">
        {page.title}
      </h1>
      {/* Hello {params.username}, you are currently viewing Page {params.pageid} */}
      <div>
        {page.contentBlocks
          ? page.contentBlocks.map((block) => (
              // <InterpretBlock key={block.id} block={block} />
              <Editor></Editor>
            ))
          : null}
      </div>
    </div>
  );
}
