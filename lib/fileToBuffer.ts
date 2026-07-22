import "server-only";

export async function fileToBuffer(file: File): Promise<Buffer> {
  //Reads the file’s contents and gives us its raw binary bytes in an ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();
  // Takes the same raw image bytes and creates a Node.js Buffer
  return Buffer.from(arrayBuffer);
}
