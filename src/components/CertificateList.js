import React from 'react';

function CertificateList({ certificates, userId }) {
  const baseUrl = '';

  return (
    <div className="certificates-section">
      <h3>Your Certificates</h3>
      <ul>
        {certificates.map((file) => (
          <li key={file.name}>
            {file.name} -{' '}
            <a
              href={`${baseUrl}/${userId}/${file.name}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Download
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CertificateList;
