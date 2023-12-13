import React, { useEffect, useState } from "react";

const TrafficCrashReport = ({ pdfData }) => {
  const [crashInfo, setCrashInfo] = useState({
    localReportNumber: null,
    reportingAgencyName: null,
    crashDateTime: null,
  });

  useEffect(() => {
    // Implement the logic to extract crash information from pdfData
    // Replace this with your actual logic for extracting crash information
    const extractedCrashInfo = extractCrashInfoFromPdfData(pdfData);

    if (extractedCrashInfo) {
      setCrashInfo(extractedCrashInfo);
    } else {
      // If crash information is not available, set them to null
      setCrashInfo({
        localReportNumber: null,
        reportingAgencyName: null,
        crashDateTime: null,
      });
    }
  }, [pdfData]);

  const extractCrashInfoFromPdfData = (pdfData) => {
    const localReportNumberRegex = /LOCAL REPORT NUMBER\s*\*\s*([^\n]+)/i;
    const reportingAgencyNameRegex =
      /SECONDARY CRASH REPORTING AGENCY NAME\s*\*\s*([^\n]+)/i;
    const crashDateTimeRegex = /CRASH DATE \/ TIME\s*\*\s*([^\n]+)/i;

    const localReportNumberMatch = pdfData.match(localReportNumberRegex);
    const reportingAgencyNameMatch = pdfData.match(reportingAgencyNameRegex);
    const crashDateTimeMatch = pdfData.match(crashDateTimeRegex);

    if (
      localReportNumberMatch &&
      reportingAgencyNameMatch &&
      crashDateTimeMatch
    ) {
      const localReportNumber = localReportNumberMatch[1].trim();
      const reportingAgencyName = reportingAgencyNameMatch[1].trim();
      const crashDateTime = crashDateTimeMatch[1].trim();
      return { localReportNumber, reportingAgencyName, crashDateTime };
    } else {
      console.error("Crash information not found in the extracted PDF data");
      return null;
    }
  };

  return (
    <div>
      <h2>Traffic Crash Report</h2>
      <p>
        {/* Display the extracted crash information in the UI or "null" if not available */}
        Local Report Number:{" "}
        {crashInfo.localReportNumber === null
          ? "null"
          : crashInfo.localReportNumber}
        <br />
        Reporting Agency Name:{" "}
        {crashInfo.reportingAgencyName === null
          ? "null"
          : crashInfo.reportingAgencyName}
        <br />
        Crash Date/Time:{" "}
        {crashInfo.crashDateTime === null ? "null" : crashInfo.crashDateTime}
      </p>
    </div>
  );
};

export default TrafficCrashReport;
