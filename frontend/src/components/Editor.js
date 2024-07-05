import { BlockNoteEditor } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { uploadFile } from "@uploadcare/upload-client";
import { useEffect, useMemo, useState } from "react";

async function saveToStorage(jsonBlocks) {
  localStorage.setItem("editorContent", JSON.stringify(jsonBlocks));
}

async function loadFromStorage() {
  const storageString = localStorage.getItem("editorContent");
  return storageString ? JSON.parse(storageString) : undefined;
}

export default function Editor({ onSave, initialData }) {
  const [initialContent, setInitialContent] = useState("loading");

  useEffect(() => {
    console.log("Initial Data in Editor: ", initialData);

    loadFromStorage().then((content) => {
      console.log("Content from storage: ", content);
      setInitialContent(initialData);
    });
  }, [initialData]);

  const editor = useMemo(() => {
    if (initialContent === "loading") {
      return undefined;
    }
    return BlockNoteEditor.create({
      initialContent,
      uploadFile: async (file) => {
        return uploadFile(file, {
          publicKey: process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY,
          store: "auto",
        }).then((response) => {
          console.log("Uploaded file: ", response.cdnUrl);
          return response.cdnUrl;
        });
      },
    });
  }, [initialContent]);

  if (editor === undefined) {
    return "Loading content...";
  }

  return (
    <BlockNoteView
      editor={editor}
      onChange={() => {
        saveToStorage(editor.document);
        onSave(editor.document);
      }}
    />
  );
}
