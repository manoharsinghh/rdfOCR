// App.js
import React, { useState } from "react";
import "./styles.css";
import { Document, pdfjs, Page } from "react-pdf";
import TrafficCrashReport from "./TrafficCrashReport"; // Import your TrafficCrashReport component
// import PdfTextDisplay from "./PdfTextDisplay";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function App() {
  const [file, setFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [displayText, setDisplayText] = useState("");
  const [pdfData, setPdfData] = useState(null); // Added state for extracted data

  const onFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setDisplayText("");
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleButtonClick = async () => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const loadingTask = pdfjs.getDocument({
          data: new Uint8Array(reader.result),
        });
        const pdf = await loadingTask.promise;
        let pdfText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          pdfText += textContent.items.map((s) => s.str).join(" ");
        }

        setDisplayText(pdfText);

        // Pass the extracted text to TrafficCrashReport component
        // and let it handle further processing
        setPdfData(pdfText);
      };

      reader.readAsArrayBuffer(file);
    }
  };

  const handleNextPage = () => {
    setPageNumber((prevPageNumber) => Math.min(prevPageNumber + 1, numPages));
  };

  const handlePrevPage = () => {
    setPageNumber((prevPageNumber) => Math.max(prevPageNumber - 1, 1));
  };

  return (
    <div className="App">
      <h1>React PDF Text Extractor</h1>
      <input type="file" onChange={onFileChange} />
      <button onClick={handleButtonClick}>Extract Text</button>
      {file && (
        <div>
          {/* Display PDF document */}
          {/* <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
            <Page pageNumber={pageNumber} />
          </Document> */}
          <p>
            Page {pageNumber} of {numPages}
          </p>
          {pageNumber > 1 && (
            <button onClick={handlePrevPage}>Previous Page</button>
          )}
          {pageNumber < numPages && (
            <button onClick={handleNextPage}>Next Page</button>
          )}
        </div>
      )}
      {/* Conditionally render the TrafficCrashReport component */}
      {pdfData && <TrafficCrashReport pdfData={pdfData} />}
      {displayText && <p>{displayText}</p>}
    </div>
  );
}

export default App;
