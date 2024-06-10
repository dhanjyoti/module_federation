import React from 'react';

const Content = (props) => {
  return (
    <div style={{ padding: '1rem', borderRadius: '0.25rem', border: '4px dashed #228b22' }} 
    data-e2e="APP_2_CONTENT_BLOCK"
    >
      <h2>App 2: Content</h2>
      <p>This is the content from app2.</p>
      <p>
        Custom text: <strong>{props.content}</strong>
      </p>
    </div>
  );
};

export default Content;