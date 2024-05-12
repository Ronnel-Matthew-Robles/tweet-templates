import React, { useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Improves accessibility

export default function TemplateModal({ isOpen, onRequestClose, template }) {
    const [copySuccess, setCopySuccess] = useState('');

    const handleCopy = async () => {
      try {
        const text = htmlToText(template.body);
        await navigator.clipboard.writeText(text);
        setCopySuccess('Copied!');
        setTimeout(() => setCopySuccess(''), 2000); // Remove the message after 2 seconds
      } catch (err) {
        setCopySuccess('Failed to copy!');
      }
    };
    
    const htmlToText = (html) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
      };

    const createMarkup = htmlString => ({ __html: htmlString });

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Template Details"
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          border: '1px solid #ccc',
          background: '#fff',
          overflow: 'auto',
          WebkitOverflowScrolling: 'touch',
          borderRadius: '10px',
          outline: 'none',
          padding: '20px'
        }
      }}
    >
      <h2>{template.emoji} {template.name}</h2>
      <h5 className='text-body-secondary'>{template.description}</h5>
      <h6>Uses: {template.uses}</h6>
      <hr></hr>
      <pre>
        <div className='container-fluid' dangerouslySetInnerHTML={createMarkup(template.body)} />
      </pre>
      <hr></hr>
      <button className='btn btn-success me-2' onClick={handleCopy}>Copy</button>
      <button className='btn btn-primary' onClick={onRequestClose}>Close</button>
      {copySuccess && <div style={{ color: 'green', marginTop: '10px' }}>{copySuccess}</div>}
    </Modal>
  );
}
