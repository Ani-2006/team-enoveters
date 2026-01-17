
import { GoogleGenAI, Type } from "@google/genai";
import { ChargingMetrics } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getEnergyInsights = async (metrics: ChargingMetrics): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze these EV charging metrics and provide a concise (2-sentence) insight about efficiency and battery health:
      Voltage: ${metrics.voltage}V
      Current: ${metrics.current}A
      Power: ${metrics.power}kW
      State of Charge: ${metrics.soc}%
      Efficiency: ${metrics.efficiency}%
      Session Energy: ${metrics.energyDelivered}kWh`,
      config: {
        systemInstruction: "You are an expert EV Energy Optimizer. Provide technical but actionable advice.",
        temperature: 0.7,
      },
    });

    return response.text || "Analyzing current charging flow for optimization...";
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return "Optimize charging during off-peak hours to reduce grid strain and battery thermal wear.";
  }
};
