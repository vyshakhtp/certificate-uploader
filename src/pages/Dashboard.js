import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';
import * as pdfjsLib from 'pdfjs-dist/webpack';


function Dashboard() {
  const [user, setUser] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const renderPdfPreview = async (pdfUrl, canvasId) => {
  const loadingTask = pdfjsLib.getDocument(pdfUrl);
  const pdf = await loadingTask.promise;
  const page = await pdf.getPage(1);
  const canvas = document.getElementById(canvasId);
  const context = canvas.getContext('2d');
  const viewport = page.getViewport({ scale: 1.0 });
  canvas.height = viewport.height;
  canvas.width = viewport.width;
  await page.render({ canvasContext: context, viewport }).promise;
};


  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUser(data.user);
        fetchCertificates(data.user);
      } else {
        navigate('/');
      }
    });
  }, []);

  const fetchCertificates = async (user) => {
    const { data, error } = await supabase.storage
      .from('certificates')
      .list(user.id + '/', {
        limit: 100,
        offset: 0,
      });

    if (!error) {
      const certsWithUrls = await Promise.all(
        data.map(async (file) => {
          const { data: urlData } = await supabase.storage
            .from('certificates')
            .getPublicUrl(`${user.id}/${file.name}`);
          return { name: file.name, url: urlData.publicUrl };
        })
      );
      setCertificates(certsWithUrls);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== 'application/pdf') {
      alert('Only PDF files are allowed.');
      return;
    }

    setIsUploading(true); // ✅ Show loader

    const filePath = `${user.id}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage
      .from('certificates')
      .upload(filePath, file);

    setIsUploading(false); // ✅ Hide loader

    if (error) {
      alert('Upload failed: ' + error.message);
    } else {
      alert('Upload successful!');
      fetchCertificates(user);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    
    <div className="dashboard-container">
      <h2>Welcome to CredHex, {user?.email}</h2>

      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>

      <div className="dashboard-grid">
        <div className="bento-box upload-box">
          <h3>Upload Certificate</h3>

          <label htmlFor="pdf-upload" className="upload-btn">
            Select PDF File
          </label>
          <input
            id="pdf-upload"
            type="file"
            accept="application/pdf"
            onChange={handleUpload}
            style={{ display: 'none' }}
          />

          <p className="upload-note">or drop your certificate PDF here</p>

          {/* ✅ Dotgrades loader appears only when uploading */}
          {isUploading && (
            <div className="dotgrades-loader">
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}
        </div>

        <div className="bento-box cert-list-box">
          <h3>Your Certificates</h3>
          {certificates.length === 0 ? (
            <p>No certificates uploaded yet.</p>
          ) : (
            <ul className="cert-list">
              {certificates.map((cert, index) => (
                <li key={index}>
                  <span className="cert-name">{cert.name}</span>
                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="download-link"
                  >
                    Download
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
