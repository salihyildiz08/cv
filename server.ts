import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

function localGermanCVRefiner(text: string, _context: string): string {
  let refined = text.trim();

  const rules = [
    { pattern: /\bich habe gelernt\b/gi, replacement: "Aneignung fundierter Fachkenntnisse in" },
    { pattern: /\bich habe gearbeitet\b/gi, replacement: "Erfolgreiche Tätigkeit im Bereich" },
    { pattern: /\bich kann\b/gi, replacement: "Umfassende Expertise in" },
    { pattern: /\bgute kenntnisse\b/gi, replacement: "Hervorragende Fachkenntnisse und praxiserprobte Fertigkeiten in" },
    { pattern: /\bgeholfen bei\b/gi, replacement: "Aktive Unterstützung und strategische Mitwirkung bei" },
    { pattern: /\bverantwortlich für\b/gi, replacement: "Verantwortung für die Konzeption, Steuerung und Leitung von" },
    { pattern: /\bich war\b/gi, replacement: "Erfolgreiche Tätigkeit als" },
    { pattern: /\bgemacht\b/gi, replacement: "Professionelle Durchführung von" },
    { pattern: /\bentwickelt\b/gi, replacement: "Konzeption, Entwicklung und erfolgreiche Implementierung von" },
    { pattern: /\bgeliştirdim\b/gi, replacement: "Konzeption, Entwicklung und End-to-End-Implementierung von" },
    { pattern: /\btasarladım\b/gi, replacement: "Professionelle Konzeption und strukturierte Gestaltung von" },
    { pattern: /\byönettim\b/gi, replacement: "Strategische Leitung und Koordination von" },
    { pattern: /\byaptım\b/gi, replacement: "Ergreifung effektiver Analyseschritte und Optimierung von" },
    { pattern: /\bçalıştım\b/gi, replacement: "Erfolgreiche Mitarbeit und lösungsorientierte Tätigkeit bei" },
    { pattern: /\böğrendim\b/gi, replacement: "Fundierte Aneignung von Fachkenntnissen im Bereich" },
    { pattern: /\bentegre ettim\b/gi, replacement: "Nahtlose Schnittstellenintegration und Migration von" },
    { pattern: /\bhızlandırdım\b/gi, replacement: "Nachhaltige Performance-Optimierung und Beschleunigung von" }
  ];

  for (const rule of rules) {
    refined = refined.replace(rule.pattern, rule.replacement);
  }

  // Ensure first letters are capitalized and lines are formatted nicely
  refined = refined.split('\n').map(line => {
    const trimmed = line.trim();
    if (trimmed.length > 0) {
      const headerRegex = /^(zusammenfassung|kenntnisse|berufserfahrung|projekte|ausbildung|sprachen|führerschein|referenzen):?/i;
      if (headerRegex.test(trimmed)) {
        return trimmed;
      }
      let formatted = trimmed;
      if (!formatted.startsWith('•') && !formatted.startsWith('-') && !formatted.startsWith('*') && !/^\d+\./.test(formatted)) {
        formatted = "• " + formatted;
      }
      return formatted.charAt(0) + formatted.slice(1);
    }
    return line;
  }).join('\n');

  return refined;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes FIRST
  app.post("/api/gemini/enhance", async (req, res) => {
    const { text, context } = req.body;
    if (!text) {
      res.status(400).json({ error: "Text is required" });
      return;
    }

    try {
      const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
      if (!apiKey) {
        console.warn("Gemini API key is not configured. Falling back to local refiner.");
        const enhancedText = localGermanCVRefiner(text, context || "");
        res.json({ text: enhancedText, mode: "local" });
        return;
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `You are a professional CV editor. Rewrite the following text to be more professional, concise, and impactful for a CV. 
        Context: ${context || 'CV block description'} (e.g., job description, summary, project details).
        Language: German.
        
        Text to rewrite: "${text}"
        
        Return ONLY the rewritten text, no explanations.`,
      });

      const enhancedText = response.text?.trim() || text;
      res.json({ text: enhancedText, mode: "api" });
    } catch (error: any) {
      console.error("Gemini enhancement failed, falling back to local:", error);
      const fallbackText = localGermanCVRefiner(text, context || "");
      res.json({ text: fallbackText, mode: "fallback" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
