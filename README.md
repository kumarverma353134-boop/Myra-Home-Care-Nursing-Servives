# MYRA Home Care Nursing Services (Patna, Bihar)
Official Website & Healthcare Service Management Platform (Version 1.0)

**Business Contact:**
- Helpline / WhatsApp: **+91 9508745151**
- Official Email: **myrahomecareservices@gmail.com**
- Head Office: **Patna, Bihar, India**

---

## 📁 Project Folder Structure (ऑर्गनाइज्ड फोल्डर स्ट्रक्चर)

```
/
├── public/
│   └── myra-homecare-github-pages.zip  <-- तैयार ज़िप पैकेज (Ready for manual download)
├── dist/                               <-- प्रोडक्शन बिल्ड (HTML, CSS और JS बंडल)
│   ├── index.html
│   └── assets/
│       ├── index-*.css
│       └── index-*.js
├── src/
│   ├── types/
│   │   └── index.ts                    <-- सभी TypeScript टाइप डेफिनिशन
│   ├── data/
│   │   ├── servicesData.ts             <-- सभी 16 क्लिनिकल नर्सिंग सेवाएं
│   │   └── mockData.ts                 <-- प्रारंभिक सीड डेटाबेस व डिफॉल्ट सेटिंग्स
│   ├── services/
│   │   ├── storage.ts                  <-- ज़ीरो-बजट रिएक्टिव डेटाबेस लेयर (LocalStorage)
│   │   ├── assistantEngine.ts          <-- फ्री रूल-बेस्ड MYRA Care Assistant (₹0 AI)
│   │   └── zipExporter.ts              <-- इन-ब्राउज़र ज़िप जनरेटर यूटिलिटी
│   ├── components/
│   │   ├── common/
│   │   │   ├── RoleSwitcherBar.tsx     <-- टॉप रोल स्विचर बार (Website, Customer, Manager, Staff, Owner)
│   │   │   ├── Header.tsx              <-- स्टिकी हेडर (Top Bar Contract)
│   │   │   ├── Footer.tsx              <-- फुटर, पॉलिसी लिंक्स व डिस्क्लेमर
│   │   │   ├── WhatsAppButton.tsx      <-- डायरेक्ट WhatsApp बटन (+91 9508745151)
│   │   │   ├── QRCodeGenerator.tsx     <-- डायनामिक वेक्टर UPI QR कोड जनरेटर
│   │   │   ├── MyraCareAssistantModal.tsx <-- हिंदी/अंग्रेजी केयर असिस्टेंट
│   │   │   ├── ServiceDetailModal.tsx  <-- 16 सेवाओं का डिटेल पॉपअप
│   │   │   ├── BookingModal.tsx        <-- 24×7 सर्विस बुकिंग व मरीज प्रोफाइल
│   │   │   ├── ZipDownloadModal.tsx    <-- वन-क्लिक ज़िप डाउनलोड व गाइड मोडल
│   │   │   └── LegalModal.tsx          <-- प्राइवेसी, टर्म्स, रिफंड व मेडिकल डिस्क्लेमर
│   │   ├── website/
│   │   │   ├── Hero.tsx
│   │   │   ├── ServicesSection.tsx     <-- 16 सेवाओं का ग्रिड
│   │   │   ├── AboutSection.tsx
│   │   │   ├── WhyChooseUs.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── CoverageSection.tsx     <-- पटना के मुख्य वार्ड व इलाके
│   │   │   ├── ReviewsSection.tsx      <-- ओनर-वेरीफाइड मरीज रिव्यू
│   │   │   ├── FAQSection.tsx
│   │   │   ├── ContactSection.tsx      <-- मैनेजर इनबॉक्स से जुड़ा इन्क्वायरी फॉर्म
│   │   │   └── MaintenanceView.tsx     <-- ओनर द्वारा नियंत्रित मेंटेनेंस स्क्रीन
│   │   ├── auth/
│   │   │   └── LoginView.tsx           <-- 4 भूमिकाओं का Google Sign-In पोर्टल
│   │   ├── customer/
│   │   │   └── CustomerDashboard.tsx   <-- प्रीमियम लाइट थीम कस्टमर डैशबोर्ड
│   │   ├── manager/
│   │   │   └── ManagerDashboard.tsx    <-- ऑपरेशन्स मैनेजर डैशबोर्ड (डिस्पैच व UPI वेरिफिकेशन)
│   │   ├── staff/
│   │   │   └── StaffDashboard.tsx      <-- फ्यूचरिस्टिक डार्क थीम स्टाफ पोर्टल
│   │   └── owner/
│   │       └── OwnerDashboard.tsx      <-- ओनर मास्टर कंट्रोल सेंटर (33 सेक्शंस)
│   ├── App.tsx                         <-- मुख्य एप्लिकेशन आर्किटेक्चर
│   ├── main.tsx
│   └── index.css                       <-- Tailwind CSS v4 व डार्क वेरिएंट
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🔑 Login URLs & Roles Guide (किसका लॉगिन कहाँ और कैसे होगा)

| रोल (Role) | यूआरएल (URL) | थीम / स्टाइल | मुख्य काम (Responsibilities) |
|---|---|---|---|
| **Customer** (मरीज व परिवार) | `/customer` या `/login?role=customer` | Premium Light Theme | नया नर्सिंग सेवा बुक करना (24×7 पटना), मरीज प्रोफाइल (Father, Mother, Child), 72-घंटे का कोटेशन स्वीकार करना, डायनामिक UPI QR कोड या Cash से भुगतान, मैनेजर से चैट। |
| **Manager** (ऑपरेशन्स लीड) | `/manager` या `/login?role=manager` | Operations Dashboard | बुकिंग रिक्वेस्ट का सत्यापन, 72-घंटे का औपचारिक कोटेशन जारी करना, स्टाफ नर्स असाइन करना, बैंक UTR का मिलान कर 'Verified Paid' मार्क करना, मैनुअल बुकिंग (फोन/व्हाट्सएप)। |
| **Staff** (नर्स एवं केयरटेकर) | `/staff` या `/login?role=staff` | Futuristic Dark Theme (Dark Navy, Neon Cyan, Glass) | असाइन की गई ड्यूटी देखना, मरीज केयर नोट्स, चेक-इन/आउट, 'Unable to Attend' इमरजेंसी बटन, सर्विस स्टार्ट व कम्पलीट करना, मैनेजर से कम्यूनिकेशन। |
| **Owner** (मालिक / मास्टर एडमिन) | `/owner` या `/login?role=owner` | White, Navy, Gold, Turquoise | 33 सेक्शंस का मास्टर कंट्रोल, स्टाफ का मूल सर्टिफिकेट भौतिक सत्यापन (Physical Audit Approval), लाइव UPI ID परिवर्तन, मेंटेनेंस मोड चालू/बंद, बिजनेस एनालिटिक्स व डेटा बैकअप। |

---

## 🚀 GitHub Pages पर फ्री में डिप्लॉय करने के 3 आसान स्टेप

1. **ZIP फाइल डाउनलोड करें**: ऐप में ऊपर दाईं ओर **"Download ZIP"** बटन दबाएं या `public/myra-homecare-github-pages.zip` फाइल प्राप्त करें।
2. **GitHub पर नया रिपॉजिटरी बनाएं**: `github.com` पर जाएं, रिपॉजिटरी का नाम रखें `myra-homecare` (Public)।
3. **फाइल्स पुश करें और Pages ऑन करें**:
   ```bash
   git init
   git add .
   git commit -m "Deploy MYRA HomeCare platform"
   git branch -M main
   git remote add origin https://github.com/<YOUR-USERNAME>/myra-homecare.git
   git push -u origin main
   ```
   Repo **Settings** > **Pages** में जाकर **Source: Deploy from a branch (`main` / `dist` / `root`)** सेलेक्ट करें। आपकी वेबसाइट लाइव हो जाएगी!

---

## 🔒 ज़ीरो-बजट व प्राइवेसी सुरक्षा नियम
1. **कोई डॉक्यूमेंट अपलोड नहीं**: वेबसाइट पर मरीज की मेडिकल फाइल, प्रिस्क्रिप्शन या टेस्ट रिपोर्ट अपलोड करने का कोई कंट्रोल नहीं रखा गया है। मरीज सीधे ऑफिशियल WhatsApp (+91 9508745151) पर प्रिस्क्रिप्शन भेजते हैं।
2. **डायनामिक UPI व कैश**: कोई पेड गेटवे चार्ज नहीं; सीधे मर्चेंट UPI ID से डायनामिक QR कोड जनरेट होता है।
3. **फ्री रूल-बेस्ड असिस्टेंट**: बिना किसी पेड AI API के हिंदी/अंग्रेजी में तुरंत सहायता देता है।


---

## Updated dashboards and Windows setup

See [`README_FINAL_SETUP_HI.md`](./README_FINAL_SETUP_HI.md) for the latest Owner Revenue & Growth chart, Manager staff management and weekly shift calendar, Staff schedule status workflow, Windows setup steps, testing checklist, and important localStorage/backend limitations.
