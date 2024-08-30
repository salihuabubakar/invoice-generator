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
