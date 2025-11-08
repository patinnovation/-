
import { GoogleGenAI } from "@google/genai";
import { Order } from '../types';

export const generateSalesAnalysis = async (orders: Order[]): Promise<string> => {
  if (!process.env.API_KEY) {
    return "API key is not configured. Please set the API_KEY environment variable.";
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const simplifiedOrders = orders.map(order => ({
    total: order.total,
    itemCount: order.items.length,
    items: order.items.map(item => ({ name: item.name, quantity: item.quantity, price: item.price })),
    date: new Date(order.timestamp).toISOString().split('T')[0],
  }));

  const prompt = `
    Analyze the following restaurant sales data and provide a concise summary.
    The data is an array of paid orders.
    
    Data:
    ${JSON.stringify(simplifiedOrders, null, 2)}

    Please provide:
    1.  A brief, encouraging overview of the sales performance.
    2.  Identify any trends or interesting patterns (e.g., popular items, busy days if data is sufficient).
    3.  Suggest one actionable tip for improvement (e.g., a promotion idea for a less popular item).
    
    Format the response as clear, readable text.
    `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Failed to generate sales analysis. Please check the console for details.";
  }
};
