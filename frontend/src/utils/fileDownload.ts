export const downloadBlobFile = (
  blob: Blob,
  fileName: string
) => {
  if (!(blob instanceof Blob)) {
    throw new Error("Invalid file");
  }

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
