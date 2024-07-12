import React from "react";
import { Button } from "./ui/button";

const InterpretBlock = ({ block }) => {
  // Assuming jsonData is the prop containing the JSON data

  // Function to render content based on type
  const renderContent = (block) => {
    switch (block.type) {
      case "heading_2":
        return (
          <h2 style={{ color: data.heading_2.rich_text[0].annotations.color }}>
            {data.heading_2.rich_text[0].text.content}
          </h2>
        );
      // Add cases for other types as needed
      case "TEXT":
        return (
          <p style={{ color: block.data.rich_text[0].annotations.color }}>
            {block.data.rich_text[0].text.content}
          </p>
        );
      default:
        return <div>Unsupported block type</div>;
    }
  };

  return (
    <>
      <div className=" flex gap-2">
        <Button variant="outline" size="icon">
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z"
              fill="currentColor"
              fill-rule="evenodd"
              clip-rule="evenodd"
            ></path>
          </svg>
        </Button>
        <div contentEditable>{renderContent(block)}</div>
      </div>
    </>
  );
};

export default InterpretBlock;
