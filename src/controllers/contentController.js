

import axios from "axios";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import AppContent from "../models/AppContent.js";
import * as cheerio from "cheerio";  // ✅ Web scraper for HTML parsing
// import { getHeaders, handleError } from "../utils/apiHelpers.js";
/**
 * Generate an AI-powered app title based on keywords.
 */
export const generateTitle = async (req, res) => {
    try {
        const { keywords } = req.body;

        if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
            return res.status(400).json({ message: "Keywords are required." });
        }

        console.log("🟢 Generating title for keywords:", keywords);

        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "mistralai/mistral-7b-instruct:free",
                messages: [
                    { role: "system", content: "You are a branding expert. Generate a short, catchy app title using the given keywords." },
                    { role: "user", content: `Generate a unique app title using these keywords: ${keywords.join(", ")}.` }
                ],
                max_tokens: 50,
                temperature: 0.9,
                top_p: 0.95
            },
            { headers: getHeaders() }
        );

        const title = response.data?.choices?.[0]?.message?.content?.trim();

        if (!title) {
            return res.status(500).json({ message: "AI did not generate a valid title." });
        }

        res.json({ title });
    } catch (error) {
        handleError(res, error, "Failed to generate title.");
    }
};

/**
 * Generate an AI-powered short description.
 */
export const generateShortDescription = async (req, res) => {
    try {
        const { title, keywords } = req.body;

        if (!title || !keywords || !Array.isArray(keywords) || keywords.length === 0) {
            return res.status(400).json({ message: "Title and keywords are required." });
        }

        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "mistralai/mistral-7b-instruct:free", // ✅ More reliable AI model
                messages: [
                    { 
                        role: "system", 
                        content: "You are an ASO expert. Generate a **short, engaging app store description** (under 100 characters). **DO NOT EXPLAIN.**"
                    },
                    { 
                        role: "user", 
                        content: `Write a short app store description for '${title}' using these keywords: ${keywords.join(", ")}.` 
                    }
                ],
                max_tokens: 80, // ✅ Increased token limit
                temperature: 0.7
            },
            { headers: getHeaders() }
        );

        const shortDescription = response.data.choices?.[0]?.message?.content?.trim();

        if (!shortDescription) {
            return res.status(500).json({ message: "AI did not generate a valid short description." });
        }

        res.json({ shortDescription });
    } catch (error) {
        handleError(res, error, "Failed to generate short description.");
    }
};
/**
 * Generate an AI-powered long description.
 */
export const generateLongDescription = async (req, res) => {
    try {
        const { title, keywords } = req.body;

        if (!title || !keywords || !Array.isArray(keywords) || keywords.length === 0) {
            return res.status(400).json({ message: "Title and keywords are required." });
        }

        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "mistralai/mistral-7b-instruct:free", // ✅ More reliable AI model
                messages: [
                    { 
                        role: "system", 
                        content: "You are an ASO expert. Generate a **detailed, engaging app store description** that highlights features and benefits. Use a **marketing tone**. **DO NOT EXPLAIN.**"
                    },
                    { 
                        role: "user", 
                        content: `Write a compelling long app store description for '${title}' using these keywords: ${keywords.join(", ")}.` 
                    }
                ],
                max_tokens: 500, // ✅ Increased token limit for better detail
                temperature: 0.7
            },
            { headers: getHeaders() }
        );

        const longDescription = response.data.choices?.[0]?.message?.content?.trim();

        if (!longDescription) {
            return res.status(500).json({ message: "AI did not generate a valid long description." });
        }

        res.json({ longDescription });
    } catch (error) {
        handleError(res, error, "Failed to generate long description.");
    }
};

puppeteer.use(StealthPlugin());

// export const analyzeCompetitorContent = async (req, res) => {
//     try {
//         const { competitorUrl } = req.body;

//         if (!competitorUrl) {
//             return res.status(400).json({ message: "Competitor app URL is required." });
//         }

//         console.log(`🔍 Scraping competitor URL: ${competitorUrl}`);

//         // Step 1: Launch Puppeteer with Stealth Mode
//         const browser = await puppeteer.launch({ headless: "new" });
//         const page = await browser.newPage();

//         await page.setUserAgent(
//             "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
//         );

//         await page.goto(competitorUrl, { waitUntil: "networkidle2", timeout: 20000 });

//         // Step 2: Handle "Read More" Buttons and Expand Sections
//         const readMoreButtons = await page.$$("button, a");
//         for (const btn of readMoreButtons) {
//             const text = await page.evaluate(el => el.innerText, btn);
//             if (text.includes("Read More") || text.includes("See More")) {
//                 console.log("ℹ️ Clicking 'Read More' to expand content...");
//                 await btn.click();
//                 await page.waitForTimeout(2000);
//             }
//         }

//         // Step 3: Handle Popups & Dialogs
//         const modalSelector = "[role='dialog'], .modal, .popup"; 
//         if (await page.$(modalSelector)) {
//             console.log("🟢 Modal detected! Extracting content...");
//             await page.waitForSelector(modalSelector, { timeout: 8000 });

//             // Extract content inside the modal
//             var modalContent = await page.evaluate(() => {
//                 return Array.from(document.querySelectorAll("[role='dialog'], .modal, .popup"))
//                     .map(el => el.innerText)
//                     .join("\n\n");
//             });

//             console.log(`📌 Modal Content Extracted: ${modalContent.substring(0, 200)}...`);
//         } else {
//             modalContent = "";
//         }

//         // Step 4: Scroll the Page to Load All Content
//         await autoScroll(page);

//         // Step 5: Extract Full Page Content (Including Modal Content)
//         const pageContent = await page.evaluate(() => document.body.innerText.trim());
//         const fullContent = pageContent + "\n\n" + modalContent;

//         console.log(`✅ Extracted Full Page Content: ${fullContent.substring(0, 300)}...`);

//         await browser.close();

//         if (!fullContent) {
//             return res.status(400).json({ message: "Failed to extract page content." });
//         }

//         // Step 6: Send Data to AI for Analysis
//         const response = await axios.post(
//             "https://openrouter.ai/api/v1/chat/completions",
//             {
//                 model: "mistralai/mistral-7b-instruct:free",
//                 messages: [
//                     {
//                         role: "system",
//                         content: "As an ASO expert, you analyzed several competitor app listings in the AI-driven content analysis and generation content."
//                     },
//                     {
//                         role: "user",
//                         content: `Analyze this competitor app listing:\n\n${fullContent}`
//                     }
//                 ],
//                 max_tokens: 500,
//                 temperature: 0.7
//             },
//             { headers: getHeaders() }
//         );

//         const analysis = response.data.choices?.[0]?.message?.content?.trim();

//         if (!analysis) {
//             return res.status(500).json({ message: "AI did not generate a valid analysis." });
//         }

//         res.json({ competitorContent: fullContent, analysis });
//     } catch (error) {
//         handleError(res, error, "Failed to analyze competitor content.");
//     }
// };


// Utility function for scrolling
export const analyzeCompetitorContent = async (req, res) => {
    try {
        const { competitorUrl } = req.body;

        if (!competitorUrl) {
            return res.status(400).json({ message: "Competitor app URL is required." });
        }

        console.log(`🔍 Scraping competitor URL: ${competitorUrl}`);

        // Step 1: Launch Puppeteer with Stealth Mode
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();

        // Set a specific user agent
        await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        );

        try {
            await page.goto(competitorUrl, { waitUntil: "networkidle2", timeout: 20000 });
        } catch (err) {
            console.error("❌ Error loading page:", err);
            return res.status(500).json({ message: "Failed to load competitor URL.", error: err.message });
        }

        // Step 2: Handle "Read More" Buttons and Expand Sections
        const readMoreButtons = await page.$$("button, a");
        for (const btn of readMoreButtons) {
            const text = await page.evaluate(el => el.innerText, btn);
            if (text.includes("Read More") || text.includes("See More")) {
                console.log("ℹ️ Clicking 'Read More' to expand content...");
                await btn.click();
                await page.waitForTimeout(2000); // Adjust timing if necessary
            }
        }

        // Step 3: Handle Popups & Dialogs
        const modalSelector = "[role='dialog'], .modal, .popup"; 
        let modalContent = "";
        if (await page.$(modalSelector)) {
            console.log("🟢 Modal detected! Extracting content...");
            await page.waitForSelector(modalSelector, { timeout: 8000 });

            // Extract content inside the modal
            modalContent = await page.evaluate(() => {
                return Array.from(document.querySelectorAll("[role='dialog'], .modal, .popup"))
                    .map(el => el.innerText)
                    .join("\n\n");
            });

            console.log(`📌 Modal Content Extracted: ${modalContent.substring(0, 200)}...`);
        }

        // Step 4: Scroll the Page to Load All Content
        await autoScroll(page);

        // Step 5: Extract Full Page Content (Including Modal Content)
        const pageContent = await page.evaluate(() => document.body.innerText.trim());
        const fullContent = pageContent + "\n\n" + modalContent;

        console.log(`✅ Extracted Full Page Content: ${fullContent.substring(0, 300)}...`);

        await browser.close();

        if (!fullContent) {
            return res.status(400).json({ message: "Failed to extract page content." });
        }

        // Step 6: Send Data to AI for Analysis
        try {
            const response = await axios.post(
                "https://openrouter.ai/api/v1/chat/completions",
                {
                    model: "mistralai/mistral-7b-instruct:free",
                    messages: [
                        {
                            role: "system",
                            content: "As an ASO expert, you analyzed several competitor app listings in the AI-driven content analysis and generation content."
                        },
                        {
                            role: "user",
                            content: `Analyze this competitor app listing:\n\n${fullContent}`
                        }
                    ],
                    max_tokens: 500,
                    temperature: 0.7
                },
                { headers: getHeaders() }
            );

            const analysis = response.data.choices?.[0]?.message?.content?.trim();

            if (!analysis) {
                return res.status(500).json({ message: "AI did not generate a valid analysis." });
            }

            res.json({ competitorContent: fullContent, analysis });
        } catch (error) {
            console.error("❌ Error with AI API:", error);
            return res.status(500).json({ message: "AI API request failed.", error: error.message });
        }
    } catch (error) {
        console.error("❌ Error during competitor content analysis:", error);
        return res.status(500).json({ message: "Failed to analyze competitor content.", error: error.message });
    }
};

async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 100;
            const timer = setInterval(() => {
                let scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;
                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 300);
        });
    });
}

// Main Function: Analyze Multiple Competitor URLs
export const analyzeMultipleUrlCompetitorContent = async (req, res) => {
    try {
      const { competitorUrls } = req.body;  // Correctly accessing `competitorUrls`
  
      if (!competitorUrls || !Array.isArray(competitorUrls) || competitorUrls.length === 0) {
        return res.status(400).json({ message: "A list of competitor URLs is required." });
      }
  
      console.log(`🔍 Scraping competitor URLs: ${competitorUrls.join(", ")}`);
  
      const browser = await puppeteer.launch({ headless: "new" });
      const results = [];
  
      for (const url of competitorUrls) {
        try {
          console.log(`🟢 Scraping: ${url}`);
          const page = await browser.newPage();
          await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
          );
  
          await page.goto(url, { waitUntil: "networkidle2", timeout: 20000 });
  
          // Click "Read More" Buttons
          const readMoreButtons = await page.$$("button, a");
          for (const btn of readMoreButtons) {
            const text = await page.evaluate((el) => el.innerText, btn);
            if (text.includes("Read More") || text.includes("See More")) {
              console.log("ℹ️ Clicking 'Read More' to expand content...");
              await btn.click();
              await page.waitForTimeout(2000);
            }
          }
  
          // Extract Modal Content
          const modalSelector = "[role='dialog'], .modal, .popup";
          let modalContent = "";
          if (await page.$(modalSelector)) {
            console.log("🟢 Modal detected! Extracting content...");
            await page.waitForSelector(modalSelector, { timeout: 8000 });
            modalContent = await page.evaluate(() =>
              Array.from(document.querySelectorAll(modalSelector)).map((el) => el.innerText).join("\n\n")
            );
          }
  
          // Scroll Page
          await autoScrollMultipage(page);


  
          // Extract Page Title & Content
          const pageTitle = await page.title();
          const pageContent = await page.evaluate(() => document.body.innerText.trim());
          const fullContent = `${pageContent}\n\n${modalContent}`;

          
  
          console.log(`✅ Extracted: ${pageTitle}`);
  
          results.push({ url, title: pageTitle, content: fullContent });
  
          await page.close();
        } catch (error) {
          console.error(`❌ Error scraping ${url}:`, error.message);
          results.push({ url, title: "Error", content: `Failed to extract content: ${error.message}` });
        }
      }
  
      await browser.close();
  
      if (results.length === 0) {
        return res.status(400).json({ message: "No content extracted from competitor URLs." });
      }
  
      // Send Data to AI for Competitor Strategy Analysis
      console.log("🤖 Sending data to AI for analysis...");
 
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "mistralai/mistral-7b-instruct:free",
          messages: [
            {
              role: "system",
              content: "Analyze multiple competitor app listings and identify key ASO strategies."
            },
            {
              role: "user",
              content: `Analyze these competitor app listings:\n\n${results
                .map((r, index) => `Competitor #${index + 1} (${r.url}) - Title: ${r.title}\n\n${r.content}`)
                .join("\n\n---\n\n")}`
            }
          ],
          max_tokens: 2000,
          temperature: 0.7
        },
        { headers: getHeaders() }
      );
      
      // Log the full response to see its structure
      console.log("Full AI Response:", response.data);
      
      // Extract and log the AI analysis
      const analysis = response.data.choices[0]?.message?.content?.trim();
      console.log("AI Strategy Analysis:", analysis);
      
      if (!analysis) {
        return res.status(500).json({ message: "AI did not generate a valid analysis." });
      }
      
      res.json({ competitors: results, strategyAnalysis: analysis });
      
    } catch (error) {
      console.error("❌ Error in analyzeCompetitorContent:", error);
      res.status(500).json({ message: "Failed to analyze competitor content." });
    }
  };
  



// Utility Function: Auto-scroll the Page
async function autoScrollMultipage(page) {
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 500;
            const timer = setInterval(() => {
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= document.body.scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 500);
        });
    });
}

/**
 * Find trending ASO keywords for an app category.
 */
// export const findTrendingKeywords = async (req, res) => {
//     try {
//         const { appCategory } = req.body;

//         if (!appCategory) {
//             return res.status(400).json({ message: "App category is required." });
//         }

//         const response = await axios.post(
//             "https://openrouter.ai/api/v1/chat/completions",
//             {
//                 model: "mistralai/mistral-7b-instruct:free",
//                 messages: [
//                     { role: "system", content: "You are an ASO expert providing trending keywords for app categories." },
//                     { role: "user", content: `Find the top 10 trending ASO keywords for '${appCategory}' apps. 
//                     Return only a **JSON array** of keywords like: ["keyword1", "keyword2", "keyword3", ...].` }
//                 ],
//                 max_tokens: 100
//             },
//             { headers: getHeaders() }
//         );

//         // ✅ Parse AI response correctly
//         const rawResponse = response.data.choices?.[0]?.message?.content?.trim();

//         let keywords = [];
//         try {
//             keywords = JSON.parse(rawResponse); // Ensure AI returns a valid array
//         } catch (error) {
//             console.log("❌ AI response was not valid JSON:", rawResponse);
//         }

//         // ✅ If AI response is empty or invalid, return a proper error
//         if (!Array.isArray(keywords) || keywords.length === 0) {
//             return res.status(500).json({ message: "AI did not return valid keywords." });
//         }

//         res.json({ keywords });
//     } catch (error) {
//         handleError(res, error, "Failed to find trending keywords.");
//     }
// };

export const findTrendingKeywords = async (req, res) => {
    try {
        const { appCategory } = req.body;

        if (!appCategory) {
            return res.status(400).json({ message: "App category is required." });
        }

        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "mistralai/mistral-7b-instruct:free",
                messages: [
                    { role: "system", content: "You are an ASO expert providing  keywords for app categories." },
                    { role: "user", content: `Find the top 10 ASO keywords for '${appCategory}' apps. 
                    Return only a **JSON array** of keywords like: ["keyword1", "keyword2", "keyword3", ...].` }
                ],
                max_tokens: 100
            },
            { headers: getHeaders() }
        );

        // ✅ Ensure response exists
        const rawResponse = response?.data?.choices?.[0]?.message?.content?.trim() || "";

        let keywords = [];
        if (rawResponse) {
            try {
                keywords = JSON.parse(rawResponse);

                // Ensure response is a valid array of strings
                if (!Array.isArray(keywords) || keywords.some(k => typeof k !== "string")) {
                    throw new Error("Invalid AI response format");
                }
            } catch (error) {
                console.error("❌ Failed to parse AI response:", rawResponse);
                keywords = [];
            }
        }

        // ✅ Return proper error if AI response is invalid
        if (keywords.length === 0) {
            return res.status(500).json({ message: "AI did not return valid keywords.", rawResponse });
        }

        res.json({ keywords });
    } catch (error) {
        handleError(res, error, "Failed to find trending keywords.");
    }
};

/**
 * Generate relevant ASO keywords.
 */
export const generateKeywords = async (req, res) => {
    try {
        const { appCategory } = req.body;

        if (!appCategory) {
            return res.status(400).json({ message: "App category is required." });
        }

        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "openai/gpt-4-turbo", // More structured AI model
                messages: [
                    { role: "system", content: "You are an ASO expert. Only return a JSON response. No explanations, no extra text, just valid JSON." },
                    { role: "user", content: `Generate exactly 10 trending ASO keywords for the '${appCategory}' category. Return JSON in this format: { "keywords": ["keyword1", "keyword2", ..., "keyword10"] }` }
                ],
                max_tokens: 100
            },
            { headers: getHeaders() }
        );

        const rawResponse = response.data.choices?.[0]?.message?.content?.trim();

        console.log("🔍 AI Raw Response:", rawResponse); // Debugging AI response

        let parsedData;

        try {
            parsedData = JSON.parse(rawResponse); // Ensure it's valid JSON
        } catch (error) {
            console.error("❌ AI response is not valid JSON:", rawResponse);
            return res.status(500).json({ message: "AI returned invalid JSON format." });
        }

        if (!parsedData.keywords || !Array.isArray(parsedData.keywords) || parsedData.keywords.length !== 10) {
            return res.status(500).json({ message: "AI did not return a valid keyword list." });
        }

        res.json({ keywords: parsedData.keywords });
    } catch (error) {
        handleError(res, error, "Failed to generate keywords.");
    }
};


/**
 * Save generated content to the database.
 */
export const saveContent = async (req, res) => {
    try {
        const { title, description, keywords } = req.body;

        if (!title || !description || !keywords) {
            return res.status(400).json({ message: "Title, description, and keywords are required." });
        }

        const content = new AppContent({ userId: req.user.id, title, description, keywords });
        await content.save();

        res.status(201).json(content);
    } catch (error) {
        handleError(res, error, "Failed to save content.");
    }
};

/**
 * Retrieve all saved content for a user.
 */
export const getContent = async (req, res) => {
    try {
        const content = await AppContent.find({ userId: req.user.id });
        res.json(content);
    } catch (error) {
        handleError(res, error, "Failed to fetch content.");
    }
};

/**
 * Utility function to get API headers.
 */
const getHeaders = () => ({
    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
    "Content-Type": "application/json",
    "HTTP-Referer": process.env.SITE_URL || "",
    "X-Title": process.env.SITE_NAME || ""
});

/**
 * Utility function to handle errors.
 */
const handleError = (res, error, message) => {
    console.error("🔴 Error:", error.response?.data || error.message);
    res.status(500).json({ message });
};
