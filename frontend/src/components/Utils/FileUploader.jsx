"use client";

import { FileUploaderRegular } from "@uploadcare/react-uploader";
import "@uploadcare/react-uploader/core.css";
import { useState } from "react";

export function FileUploader() {
  const [files, setFiles] = useState([]);

  const handleChangeEvent = (items) => {
    setFiles([...items.allEntries.filter((file) => file.status === "success")]);
  };

  return (
    <div>
      <FileUploaderRegular
        onChange={handleChangeEvent}
        pubkey="1271465b49f17e050ad9"
      />

      <div>
        {files.map((file) => (
          <div key={file.uuid}>
            <img src={file.cdnUrl} alt={file.fileInfo.originalFilename} />
          </div>
        ))}
      </div>
    </div>
  );
}
