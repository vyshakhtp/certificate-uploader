import React from 'react';

function UploadForm({ onUpload }) {
  return (
    <div className="upload-section">
      <h3>Upload Certificate</h3>
      <input type="file" accept="application/pdf" onChange={onUpload} />
    </div>
  );
}

export default UploadForm;
