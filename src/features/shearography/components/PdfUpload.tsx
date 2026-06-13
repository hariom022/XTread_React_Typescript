type PdfFile = {
  file: File;
  url: string;
  name: string;
};

type Props = {
  pdfFiles: PdfFile[];
  previewIndex: number | null;
  setPreviewIndex: React.Dispatch<
    React.SetStateAction<number | null>
  >;
  handlePdfUpload: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  removePdf: (index: number) => void;
};

const PdfUpload = ({
  pdfFiles,
  previewIndex,
  setPreviewIndex,
  handlePdfUpload,
  removePdf,
}: Props) => {
  return (
    <>
      {/* Upload Section */}
      <div className="col-md-6">
        <label className="fw-semibold mb-2 d-block text-start">
          Upload Report{" "}
          <span className="fs-6 text-muted">
            (max 2 pdfs)
          </span>
        </label>

        <input
          type="file"
          accept="application/pdf"
          multiple
          className="form-control"
          onChange={handlePdfUpload}
          disabled={pdfFiles.length >= 2}
        />

        {pdfFiles.length > 0 && (
          <div className="mt-3">
            {pdfFiles.map((pdf, index) => (
              <div
                key={index}
                className="d-flex justify-content-between align-items-center border rounded p-2 mb-2"
              >
                <span className="fw-semibold">
                  {pdf.name}
                </span>

                <div className="d-flex gap-2">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() =>
                      setPreviewIndex(index)
                    }
                  >
                    Preview
                  </button>

                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() =>
                      removePdf(index)
                    }
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview Section */}
      <div className="col-md-6">
        {previewIndex !== null &&
          pdfFiles[previewIndex] && (
            <div className="border rounded p-2 h-100">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <strong>PDF Preview</strong>

                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() =>
                    setPreviewIndex(null)
                  }
                >
                  Close Preview
                </button>
              </div>

              <iframe
                src={pdfFiles[previewIndex].url}
                title="PDF Preview"
                width="100%"
                height="400px"
                style={{
                  border: "1px solid #ccc",
                }}
              />
            </div>
          )}
      </div>
    </>
  );
};

export default PdfUpload;