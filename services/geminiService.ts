export const enhanceText = async (text: string, context: string): Promise<string> => {
  try {
    const response = await fetch("/api/gemini/enhance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text, context })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP error ${response.status}`);
    }

    const data = await response.json();
    return data.text || text;
  } catch (error) {
    console.error("Gemini enhancement failed:", error);
    return text;
  }
};
