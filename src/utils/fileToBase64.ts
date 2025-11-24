export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };

    reader.onerror = (error) => reject(error);

    reader.readAsDataURL(file); // vem "data:image/png;base64,AAAA..."
  });
}
