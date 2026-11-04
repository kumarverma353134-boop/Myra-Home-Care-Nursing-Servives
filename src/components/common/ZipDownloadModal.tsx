import React, { useState } from 'react';
import { X, Download, CheckCircle, FolderArchive, Terminal, Globe, Shield, User, Briefcase, Activity, Copy, Check } from 'lucide-react';
import { generateProjectZip } from '../../services/zipExporter';

interface ZipDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ZipDownloadModal: React.FC<ZipDownloadModalProps> = ({ isOpen, onClose }) => {
  const [downloading, setDownloading] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [downloaded, setDownloaded] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const blob = await generateProjectZip((percent, msg) => {
        setProgressMsg(`${msg} (${percent}%)`);
      });

      // Trigger browser download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'myra-homecare-github-pages-v1.0.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloading(false);
      setDownloaded(true);
    } catch (err) {
      console.error('ZIP generation failed:', err);
      setDownloading(false);
      alert('Zip generation error. Please try again.');
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(id);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="zip-modal-title"
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-teal-500/20 text-teal-300">
              Zero-Budget GitHub Pages Deployment
            </span>
          </div>
          <h2 id="zip-modal-title" className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <FolderArchive className="w-6 h-6 text-teal-400" />
            Download Source Code ZIP & Setup Guide
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            यहाँ से आप पूरे प्रोजेक्ट का ZIP डाउनलोड करके सीधे GitHub Pages पर फ्री में होस्ट कर सकते हैं।
          </p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-sm">
          {/* Main Download Button */}
          <div className="p-5 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl border border-teal-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                📦 Complete Project ZIP Package
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                All React TypeScript components, Tailwind styles, 16 services, 4 dashboards, and GitHub Pages configuration.
              </p>
            </div>
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="w-full sm:w-auto px-6 py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>{downloading ? progressMsg || 'Packaging ZIP...' : downloaded ? 'Download Again (ZIP)' : 'Download Project ZIP'}</span>
            </button>
          </div>

          {/* Role Login URLs Guide in Hindi */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              🔑 Role Login URLs & Dashboard Routing (किसका लॉगिन कहाँ होगा):
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {/* Customer */}
              <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-900 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-blue-600" />
                    Customer (मरीज / परिवार)
                  </span>
                  <button
                    onClick={() => copyToClipboard('/customer', 'cust')}
                    className="text-[10px] text-blue-700 hover:underline flex items-center gap-0.5"
                  >
                    {copiedUrl === 'cust' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    Copy URL
                  </button>
                </div>
                <div className="font-mono text-[11px] text-blue-800 bg-white px-2 py-1 rounded border border-blue-100">
                  /customer या /login?role=customer
                </div>
                <p className="text-[11px] text-slate-600">
                  मरीज प्रोफाइल, 16 सर्विस बुकिंग, 72-घंटे का कोटेशन, UPI QR कोड पेमेंट व ट्रैकिंग।
                </p>
              </div>

              {/* Manager */}
              <div className="p-3.5 bg-indigo-50/70 rounded-xl border border-indigo-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-900 flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-indigo-600" />
                    Manager (ऑपरेशन्स लीड)
                  </span>
                  <button
                    onClick={() => copyToClipboard('/manager', 'mgr')}
                    className="text-[10px] text-indigo-700 hover:underline flex items-center gap-0.5"
                  >
                    {copiedUrl === 'mgr' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    Copy URL
                  </button>
                </div>
                <div className="font-mono text-[11px] text-indigo-800 bg-white px-2 py-1 rounded border border-indigo-100">
                  /manager या /login?role=manager
                </div>
                <p className="text-[11px] text-slate-600">
                  नई बुकिंग अप्रूवल, कोटेशन बनाना, स्टाफ को असाइन करना, UPI UTR सत्यापन व चैट।
                </p>
              </div>

              {/* Staff */}
              <div className="p-3.5 bg-slate-900 text-slate-100 rounded-xl border border-cyan-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cyan-400 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    Staff (नर्स एवं केयरटेकर)
                  </span>
                  <button
                    onClick={() => copyToClipboard('/staff', 'stf')}
                    className="text-[10px] text-cyan-300 hover:underline flex items-center gap-0.5"
                  >
                    {copiedUrl === 'stf' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    Copy URL
                  </button>
                </div>
                <div className="font-mono text-[11px] text-cyan-300 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                  /staff या /login?role=staff
                </div>
                <p className="text-[11px] text-slate-400">
                  Futuristic Dark UI: ड्यूटी शेड्यूल, चेक-इन/आउट, 'Unable to Attend' इमरजेंसी बटन, सर्विस स्टार्ट/कंप्लीट।
                </p>
              </div>

              {/* Owner */}
              <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-900 flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-amber-600" />
                    Owner (मालिक / मास्टर कंट्रोल)
                  </span>
                  <button
                    onClick={() => copyToClipboard('/owner', 'own')}
                    className="text-[10px] text-amber-700 hover:underline flex items-center gap-0.5"
                  >
                    {copiedUrl === 'own' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    Copy URL
                  </button>
                </div>
                <div className="font-mono text-[11px] text-amber-800 bg-white px-2 py-1 rounded border border-amber-100">
                  /owner या /login?role=owner
                </div>
                <p className="text-[11px] text-slate-600">
                  33 सेक्शंस का पूरा कंट्रोल, स्टाफ वेरिफिकेशन, लाइव UPI ID परिवर्तन, मेंटेनेंस मोड व एनालिटिक्स।
                </p>
              </div>
            </div>
          </div>

          {/* GitHub Pages 3-Step Guide */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              🚀 How to Deploy on GitHub Pages Manually (सरल हिन्दी में 3 स्टेप):
            </h3>

            <div className="space-y-2 text-xs text-slate-700">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <strong className="text-slate-900 block mb-1">
                  Step 1: Unzip & GitHub Repository बनाएं
                </strong>
                डाउनलोड की गई ZIP फाइल को अपने कंप्यूटर पर एक्सट्रैक्ट (Unzip) करें। github.com पर एक नया रिपॉजिटरी बनाएं, उदाहरण के लिए: <code>myra-homecare</code> (Public चुनें).
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <strong className="text-slate-900 block mb-1">
                  Step 2: टर्मिनल या VS Code से फाइल्स पुश करें
                </strong>
                <pre className="p-2 bg-slate-900 text-teal-300 rounded-lg font-mono text-[11px] overflow-x-auto">
{`git init
git add .
git commit -m "Deploy MYRA HomeCare website"
git branch -M main
git remote add origin https://github.com/<YOUR-USERNAME>/myra-homecare.git
git push -u origin main`}
                </pre>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <strong className="text-slate-900 block mb-1">
                  Step 3: GitHub Pages Active करें
                </strong>
                अपने GitHub Repo में <strong>Settings</strong> &gt; <strong>Pages</strong> में जाएं। <strong>Source</strong> में <code>Deploy from a branch</code> चुनें, branch में <code>main</code> और folder <code>/ (root)</code> सेलेक्ट करके <strong>Save</strong> दबाएं। 2 मिनट में आपकी वेबसाइट लाइव हो जाएगी!
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700 transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
