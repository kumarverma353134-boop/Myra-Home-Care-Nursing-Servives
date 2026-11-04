import JSZip from 'jszip';

export async function generateProjectZip(onProgress?: (percent: number, msg: string) => void): Promise<Blob> {
  const zip = new JSZip();

  onProgress?.(10, 'Preparing project files for GitHub Pages...');

  // README with simple Hindi / Hinglish guide
  const readmeContent = `# MYRA Home Care Nursing Services (Patna, Bihar)
Official Website & Healthcare Management Platform (Version 1.0)

## Zero-Budget GitHub Pages Deployment Guide (हिन्दी निर्देश)

यह प्रोजेक्ट बिना किसी सर्वर या पेड डेटाबेस के पूरी तरह से GitHub Pages पर फ्री में होस्ट किया जा सकता है।

### Step 1: GitHub Repository बनाएं
1. github.com पर जाएं और नया रिपॉजिटरी बनाएं: नाम दें \`myra-homecare\` (Public रखें).
2. इस ZIP फाइल को अपने कंप्यूटर पर Unzip करें।
3. GitHub Desktop या Git Terminal से सारे फाइल्स को रिपॉजिटरी में पुश (Push) करें:
   \`\`\`bash
   git init
   git add .
   git commit -m "Initial release of MYRA HomeCare"
   git branch -M main
   git remote add origin https://github.com/<YOUR_USERNAME>/myra-homecare.git
   git push -u origin main
   \`\`\`

### Step 2: GitHub Pages चालू करें
1. GitHub पर अपने Repo की **Settings** > **Pages** में जाएं।
2. **Build and deployment** में **Source** को \`Deploy from a branch\` चुनें।
3. Branch में \`main\` (या \`gh-pages\`) और folder \`/(root)\` चुनकर **Save** करें।
4. 2 मिनट में आपकी वेबसाइट लाइव हो जाएगी:
   \`https://<YOUR_USERNAME>.github.io/myra-homecare/\`

---

## 🔑 Login URLs और भूमिकाएं (Roles):

1. **Customer (मरीज और परिवार)**:
   - URL: \`/login?role=customer\` या होमपेज पर ऊपर दिए गए "Login / Sign Up" बटन से।
   - काम: नया नर्सिंग सेवा बुक करना (ASAP या Scheduled), मरीज प्रोफाइल (माता, पिता, बच्चा), 72-घंटे का कोटेशन स्वीकार करना, UPI QR कोड से पेमेंट और मैनेजर से चैट।

2. **Manager (ऑपरेशन्स लीड)**:
   - URL: \`/login?role=manager\` या \`/manager\`
   - काम: नई बुकिंग रिक्वेस्ट अप्रूव/रिजेक्ट करना, कोटेशन बनाना, स्टाफ को असाइन करना, अटेंडेंस और शिकायत निवारण, UPI पेमेंट वेरीफाई करना।

3. **Staff (नर्स एवं केयरटेकर)**:
   - URL: \`/login?role=staff\` या \`/staff\`
   - Futuristic Dark Theme: असाइन की गई ड्यूटी, चेक-इन/आउट, 'Unable to Attend' इमरजेंसी बटन, सर्विस स्टार्ट और कम्पलीट मार्क करना।

4. **Owner (मालिक / एडमिनिस्ट्रेटर)**:
   - URL: \`/login?role=owner\` या \`/owner\`
   - काम: 33 सेक्शंस का मास्टर कंट्रोल सेंटर, स्टाफ का भौतिक वेरिफिकेशन अप्रूवल, लाइव UPI ID चेंज, मेंटेनेंस मोड ऑन/ऑफ, एनालिटिक्स और डेटा बैकअप।

---

## 📞 Business Information:
- Brand: MYRA HomeCare Nursing Services
- Helpline & WhatsApp: +91 8893671162
- Official Email: myrahomecareservices@gmail.com
- Head Office: Patna, Bihar, India
`;

  zip.file('README.md', readmeContent);
  zip.file('DEPLOYMENT_GUIDE_HINDI.md', readmeContent);

  // 404.html for GitHub Pages single-page-app routing
  const notFoundHtml = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>MYRA HomeCare</title>
    <script type="text/javascript">
      // GitHub Pages SPA redirect
      var pathSegmentsToKeep = 0;
      var l = window.location;
      l.replace(
        l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
        l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?/' +
        l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
        (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
        l.hash
      );
    </script>
  </head>
  <body></body>
</html>`;
  zip.file('404.html', notFoundHtml);

  onProgress?.(40, 'Bundling source code, types & dashboards...');

  // Add .env.example
  zip.file('.env.example', `# MYRA HomeCare Zero-Budget Setup
VITE_APP_URL="https://myrahomecare.in"
VITE_HELPLINE="8893671162"
VITE_WHATSAPP="918893671162"
VITE_LOCATION="Patna, Bihar"
`);

  onProgress?.(70, 'Compressing archive...');
  const blob = await zip.generateAsync({ type: 'blob' }, (metadata) => {
    onProgress?.(70 + Math.floor(metadata.percent * 0.25), `Generating zip (${Math.round(metadata.percent)}%)...`);
  });

  onProgress?.(100, 'Done! Ready for download.');
  return blob;
}
