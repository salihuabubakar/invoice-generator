import React from 'react'
import { Popup } from "semantic-ui-react";

export default function PopUpText({ text }: any ){
  return (
    <>
      <Popup
        mouseEnterDelay={100}
        mouseLeaveDelay={100}
        hoverable={true}
        content={text}
        style={{
          border: "1px solid #3cb0fd",
        }}
        trigger={
          <span
            style={{
              border: "0",
              textOverflow: "ellipsis", whiteSpace: "nowrap"
            }}
          >
            <span className='text-sm'>{text}</span>
          </span>
        }
      />
    </>
  );
};
