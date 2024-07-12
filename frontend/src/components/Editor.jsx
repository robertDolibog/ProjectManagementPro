import { BlockNoteEditor, filterSuggestionItems } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import {
  SuggestionMenuController,
  getDefaultReactSlashMenuItems,
} from "@blocknote/react";
import { uploadFile } from "@uploadcare/upload-client";
import { useEffect, useMemo, useRef, useState } from "react";
import { ImMagicWand } from "react-icons/im";

async function saveToStorage(jsonBlocks) {
  localStorage.setItem("editorContent", JSON.stringify(jsonBlocks));
}

async function loadFromStorage() {
  const storageString = localStorage.getItem("editorContent");
  return storageString ? JSON.parse(storageString) : undefined;
}

export default function Editor({ onSave, initialData }) {
  const [initialContent, setInitialContent] = useState([]);
  const editorRef = useRef(null);

  useEffect(() => {
    console.log("Initial Data in Editor: ", initialData);

    loadFromStorage().then((content) => {
      console.log("Content from storage: ", content);
      const newContent =
        initialData && Array.isArray(initialData) && initialData.length > 0
          ? initialData
          : content || [{ type: "paragraph", content: [] }];
      // Only update if different to prevent loop
      if (JSON.stringify(newContent) !== JSON.stringify(initialContent)) {
        setInitialContent(newContent);
      }
    });
  }, [initialData]);

  const callCompletionApi = async (editor, prompt) => {
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const jsonResponse = await response.json();
      if (
        jsonResponse &&
        jsonResponse.choices &&
        jsonResponse.choices.length > 0
      ) {
        const content = jsonResponse.choices[0].message.content;
        editor._tiptapEditor.commands.insertContent(content);
      } else {
        console.error("Invalid response format or empty choices array");
      }
    } catch (error) {
      console.error("Error fetching or processing the response", error);
    }
  };

  const insertMagicAi = (editor) => {
    const text = getPrevText(editor._tiptapEditor, {
      chars: 5000,
      offset: 1,
    });
    callCompletionApi(editor, text);
  };

  const insertMagicItem = (editor) => ({
    title: "Continue with AI",
    onItemClick: () => insertMagicAi(editor),
    aliases: ["ai", "magic"],
    group: "Magic",
    icon: <ImMagicWand size={18} />,
    hint: "Continue your idea with some extra inspiration!",
  });

  // List containing all default Slash Menu Items, as well as our custom one.
  const getCustomSlashMenuItems = (editor) => [
    insertMagicItem(editor),
    ...getDefaultReactSlashMenuItems(editor),
  ];

  const getPrevText = (editor, { chars, offset = 0 }) => {
    if (!editor?.state?.doc) {
      console.error("Editor state or doc is undefined");
      return "";
    }
    return editor.state.doc.textBetween(
      Math.max(0, editor.state.selection.from - chars),
      editor.state.selection.from - offset,
      "\n"
    );
  };

  const editor = useMemo(() => {
    if (initialContent.length === 0) {
      return undefined;
    }
    const newEditor = BlockNoteEditor.create({
      initialContent,
      slashMenuItems: getCustomSlashMenuItems,
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
    editorRef.current = newEditor;
    return newEditor;
  }, [initialContent]);

  if (!editor) {
    return "Loading content...";
  }

  return (
    <BlockNoteView
      editor={editor}
      onChange={() => {
        saveToStorage(editor.document);
        onSave(editor.document);
      }}
      slashMenu={false}
    >
      <SuggestionMenuController
        triggerCharacter={"/"}
        // Replaces the default Slash Menu items with our custom ones.
        getItems={async (query) =>
          filterSuggestionItems(getCustomSlashMenuItems(editor), query)
        }
      />
    </BlockNoteView>
  );
}
