const axios = require("axios");

// @desc    Analyze complaint using OpenRouter AI API
// @route   POST /api/ai/analyze
// @access  Public
const analyzeComplaint = async (req, res) => {
  const { title, description, category, location } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: "Title and description are required for AI analysis" });
  }

  try {
    const prompt = `You are an AI assistant for a government complaint management system. Analyze the following complaint and provide a structured response.

Complaint Details:
- Title: ${title}
- Category: ${category || "Not specified"}
- Location: ${location || "Not specified"}
- Description: ${description}

Please provide the following in JSON format only (no extra text):
{
  "urgency": "High/Medium/Low with brief reason",
  "department": "Name of the responsible government department",
  "autoResponse": "A professional automated response message to the complainant (2-3 sentences)",
  "summary": "A brief 1-2 sentence summary of the complaint"
}`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct:free",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 500,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "Complaint Management System",
        },
      }
    );

    // Extract AI response text
    const aiText = response.data.choices[0].message.content.trim();

    // Parse JSON from AI response
    let aiResult;
    try {
      // Extract JSON from response (handle cases where AI adds extra text)
      const jsonMatch = aiText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        aiResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      // Fallback if JSON parsing fails
      aiResult = {
        urgency: "Medium - Unable to determine automatically",
        department: getDepartmentByCategory(category),
        autoResponse: `Thank you for submitting your complaint regarding "${title}". Our team has received your complaint and will review it shortly. You will be notified of any updates.`,
        summary: `Complaint about ${category || "general issue"} in ${location || "unspecified location"}.`,
      };
    }

    res.json({
      message: "AI analysis completed successfully",
      analysis: aiResult,
    });
  } catch (error) {
    console.error("AI analysis error:", error.response?.data || error.message);

    // Fallback response if AI API fails
    const fallbackAnalysis = {
      urgency: getFallbackUrgency(category),
      department: getDepartmentByCategory(category),
      autoResponse: `Thank you for submitting your complaint regarding "${title}". We have received your complaint and our concerned department will look into it. You can track the status using your complaint ID.`,
      summary: `Complaint about ${category || "general issue"} submitted from ${location || "unspecified location"}.`,
    };

    res.json({
      message: "AI analysis completed (fallback mode)",
      analysis: fallbackAnalysis,
    });
  }
};

// Helper: Get department based on category
const getDepartmentByCategory = (category) => {
  const departmentMap = {
    "Water Supply": "Water Supply & Sanitation Department",
    Electricity: "Electricity & Power Department",
    "Roads & Infrastructure": "Public Works Department (PWD)",
    "Sanitation & Garbage": "Municipal Sanitation Department",
    "Public Safety": "Police & Public Safety Department",
    Healthcare: "Health & Medical Services Department",
    Education: "Education Department",
    Other: "General Administration Department",
  };
  return departmentMap[category] || "General Administration Department";
};

// Helper: Get fallback urgency based on category
const getFallbackUrgency = (category) => {
  const highUrgency = ["Public Safety", "Healthcare", "Water Supply"];
  const mediumUrgency = ["Electricity", "Roads & Infrastructure"];

  if (highUrgency.includes(category)) return "High - Immediate attention required";
  if (mediumUrgency.includes(category)) return "Medium - Needs attention within 48 hours";
  return "Low - Can be addressed within a week";
};

module.exports = { analyzeComplaint };
