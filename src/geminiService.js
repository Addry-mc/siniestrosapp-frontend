export async function obtenerRespuesta(prompt) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error("No se encontró la variable VITE_GEMINI_API_KEY en .env.local");
    }

    // Usamos el modelo gemini-3.8-flash recomendado por la API
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            contents: [
                {
                    parts: [{ text: prompt }],
                },
            ],
        }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `Error HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const respuestaTexto = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!respuestaTexto) {
        throw new Error("La API respondió pero no devolvió texto.");
    }

    return respuestaTexto;
}