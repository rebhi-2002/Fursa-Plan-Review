// ====================================================
// Fursa Platform — Image Generation Script
// استخدم هذا الملف لتوليد/تجديد جميع صور المشروع
// Run inside Replit Agent code_execution sandbox
// ====================================================

// Start generating all images asynchronously
const results = await Promise.all([

  // 1. Home page hero background (person silhouette, very subtle)
  generateImageAsync({
    images: [{
      prompt: "Professional Palestinian young man working on laptop in a modern digital workspace, soft natural lighting, hopeful atmosphere, Gaza employment platform, clean minimal background, photorealistic",
      outputPath: "artifacts/fursa/public/img/home-hero-person.png",
      aspectRatio: "16:9",
      negativePrompt: "text, watermark, logo, blurry, low quality, dark, war, conflict",
      summary: "fursa home hero person",
    }]
  }),

  // 2. About page hero
  generateImageAsync({
    images: [{
      prompt: "Diverse group of Palestinian professionals collaborating in a bright modern office, teamwork, digital economy, optimistic Gaza community, warm golden hour lighting, photorealistic",
      outputPath: "artifacts/fursa/public/img/about-hero.png",
      aspectRatio: "16:9",
      negativePrompt: "text, watermark, war, conflict, blurry, low quality",
      summary: "fursa about hero",
    }]
  }),

  // 3. For Employers hero (professional hiring)
  generateImageAsync({
    images: [{
      prompt: "Professional employer interviewing a qualified candidate in a clean modern office setting, hiring process, digital recruitment platform, Middle Eastern professionals, photorealistic",
      outputPath: "artifacts/fursa/public/img/for-employers-hero.png",
      aspectRatio: "16:9",
      negativePrompt: "text, watermark, war, conflict, blurry, low quality",
      summary: "fursa employers hero",
    }]
  }),

  // 4. Success Stories hero
  generateImageAsync({
    images: [{
      prompt: "Smiling successful Palestinian professional at their desk with laptop, celebrating career achievement, bright and uplifting atmosphere, digital work from Gaza, photorealistic",
      outputPath: "artifacts/fursa/public/img/success-stories-hero.png",
      aspectRatio: "16:9",
      negativePrompt: "text, watermark, war, conflict, blurry, low quality",
      summary: "fursa success stories hero",
    }]
  }),

  // 5. Job Seekers / Employers List hero
  generateImageAsync({
    images: [{
      prompt: "Young Palestinian job seekers browsing opportunities on laptop and phone, bright modern co-working space, diverse group of professionals, hopeful digital future, photorealistic",
      outputPath: "artifacts/fursa/public/img/seekers-hero.png",
      aspectRatio: "16:9",
      negativePrompt: "text, watermark, war, conflict, blurry, low quality",
      summary: "fursa seekers hero",
    }]
  }),

  // 6. Contact page hero
  generateImageAsync({
    images: [{
      prompt: "Friendly customer support professional at a modern workstation with headset, warm welcoming office environment, digital communication, Middle Eastern professional, photorealistic",
      outputPath: "artifacts/fursa/public/img/contact-hero.png",
      aspectRatio: "16:9",
      negativePrompt: "text, watermark, blurry, low quality",
      summary: "fursa contact hero",
    }]
  }),

  // 7. FAQ page hero
  generateImageAsync({
    images: [{
      prompt: "Person browsing a clean FAQ knowledge base on a laptop, modern minimal workspace, soft blue and white tones, professional digital support environment, photorealistic",
      outputPath: "artifacts/fursa/public/img/faq-hero.png",
      aspectRatio: "16:9",
      negativePrompt: "text, watermark, blurry, low quality",
      summary: "fursa faq hero",
    }]
  }),

  // 8. Documentation / User Guide hero
  generateImageAsync({
    images: [{
      prompt: "Open documentation book with digital interface elements floating around, modern flat design, clean white background, soft blue accent colors, user guide concept, minimal professional",
      outputPath: "artifacts/fursa/public/img/docs-hero.png",
      aspectRatio: "16:9",
      negativePrompt: "text, watermark, blurry, low quality, dark",
      summary: "fursa docs hero",
    }]
  }),

  // 9. OpenGraph / Social Share image (platform branding)
  generateImageAsync({
    images: [{
      prompt: "Fursa digital employment platform brand visual, bold blue and white design, Palestinian flag colors accent, modern job board platform logo concept, Gaza opportunities, clean professional graphic",
      outputPath: "artifacts/fursa/public/opengraph.png",
      aspectRatio: "16:9",
      negativePrompt: "blurry, low quality, war, conflict, dark",
      summary: "fursa opengraph social",
    }]
  }),

  // 10. Slides hero — network / connectivity
  generateImageAsync({
    images: [{
      prompt: "Abstract digital network of glowing blue nodes and connections, representing employment opportunities and digital economy in Gaza, modern technology concept, dark background with blue light trails",
      outputPath: "artifacts/fursa-slides/public/hero-network.png",
      aspectRatio: "16:9",
      negativePrompt: "text, watermark, blurry, low quality",
      summary: "fursa slides network hero",
    }]
  }),

  // 11. Fursa logo
  generateImageAsync({
    images: [{
      prompt: "Minimal flat logo for Fursa — فرصة, a Palestinian digital job platform, bold Arabic calligraphy style letter with a door or keyhole symbol representing opportunity, primary blue color #3b5bdb on white background, modern professional logo design",
      outputPath: "attached_assets/fursa-logo-new.png",
      aspectRatio: "1:1",
      negativePrompt: "text labels, busy design, multiple colors, gradients, shadow",
      summary: "fursa logo mark",
    }]
  }),

  // 12. Fursa favicon
  generateImageAsync({
    images: [{
      prompt: "Simple minimal favicon icon for Fursa job platform, bold letter F with a small door symbol integrated, flat design, primary blue #3b5bdb on white, clean 512x512 icon style",
      outputPath: "attached_assets/fursa-favicon-new.png",
      aspectRatio: "1:1",
      negativePrompt: "text, complex design, gradients, shadow, multiple icons",
      summary: "fursa favicon icon",
    }]
  }),

]);

// ====================================================
// Log results
// ====================================================
for (const result of results) {
  if (result.imagePaths) {
    console.log("✓ Queued:", result.imagePaths.join(", "), "| workflowId:", result.workflowId);
  } else {
    console.log("✗ Failed:", JSON.stringify(result));
  }
}

console.log("\nAll image generation jobs submitted. Use query_background_job(workflowId) to check status.");
