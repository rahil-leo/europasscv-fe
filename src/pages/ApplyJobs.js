import React, { useEffect, useState } from 'react';
import api from '../api/api';
import Disclosure from '../components/Disclosure';
import LanguageToggle from '../components/LanguageToggle';

const ACCESS_PASSWORD = 'eurocvstudio@2830'; // change this to whatever you want to share with clients

export default function ApplyJobs() {
    const [portals, setPortals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [unlocked, setUnlocked] = useState(false);
    const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [pendingUrl, setPendingUrl] = useState(null);
    const [language, setLanguage] = useState('en');

    useEffect(() => {
        api.get('/job-portals').then((res) => setPortals(res.data)).finally(() => setLoading(false));
        if (sessionStorage.getItem('jobPortalUnlocked') === 'true') {
            setUnlocked(true);
        }
    }, []);

    function handleApplyClick(url) {
        if (unlocked) {
            window.open(url, '_blank', 'noopener,noreferrer');
            return;
        }
        setPendingUrl(url);
        setShowPasswordPrompt(true);
        setError('');
        setPassword('');
    }

    function handleVerify(e) {
        e.preventDefault();
        if (password === ACCESS_PASSWORD) {
            setUnlocked(true);
            sessionStorage.setItem('jobPortalUnlocked', 'true');
            setShowPasswordPrompt(false);
            if (pendingUrl) window.open(pendingUrl, '_blank', 'noopener,noreferrer');
        } else {
            setError('Incorrect password. This access is for clients who booked a CV with us.');
        }
    }

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
          <Disclosure
              title={language === 'en' ? 'Important: Protect yourself from job scams' : 'പ്രധാനം: ജോലി തട്ടിപ്പുകളിൽ നിന്ന് സ്വയം സംരക്ഷിക്കുക'}
              icon="⚠️"
          >
              <div className="flex justify-end mb-3">
                  <LanguageToggle language={language} onToggle={() => setLanguage(language === 'en' ? 'ml' : 'en')} />
              </div>

              {language === 'en' ? (
                  <>
                      <p className="mb-3">
                          The portals listed here are official or well-established platforms for finding job opportunities in Europe. We share them purely for your convenience — we are not affiliated with these portals and cannot guarantee job availability, response rates, or visa outcomes.
                      </p>
                      <p className="mb-2 font-medium text-slate-700">Please keep these safety points in mind:</p>
                      <ul className="list-disc pl-5 space-y-2">
                          <li>Recruitment is always free for candidates. Staffing agencies like Randstad, Adecco, and Manpower are paid by the hiring company, never by job seekers. If anyone asks you to pay a "registration fee," "processing fee," or "visa fee" to get a job through one of these agencies, it's a scam.</li>
                          <li>Never pay money to anyone promising a "guaranteed job" or "guaranteed visa sponsorship." Genuine employers and government programs do not charge job seekers for this.</li>
                          <li>Visa and work permit rules are set by each country's government, not by job portals. Always verify requirements on the official government immigration website for that country.</li>
                          <li>Be extra cautious with "unskilled/labour job with visa sponsorship" offers circulated on WhatsApp, Telegram, or unofficial websites — this space has a high number of scams targeting job seekers.</li>
                          <li>Always apply through the official website of the company or agency (e.g., randstad.com, adecco.com) — not through a link sent by someone claiming to be a "recruiter" on WhatsApp or Telegram.</li>
                          <li>When in doubt, apply directly through the employer's or government's official website rather than a third-party agent.</li>
                      </ul>
                  </>
              ) : (
                  <>
                      <p className="mb-3">
                          ഇവിടെ പട്ടികപ്പെടുത്തിയിരിക്കുന്ന പോർട്ടലുകൾ യൂറോപ്പിലെ തൊഴിലവസരങ്ങൾ കണ്ടെത്താനുള്ള ഔദ്യോഗികമോ വിശ്വസനീയമോ ആയ പ്ലാറ്റ്‌ഫോമുകളാണ്. നിങ്ങളുടെ സൗകര്യത്തിനു വേണ്ടി മാത്രമാണ് ഞങ്ങൾ ഇവ പങ്കിടുന്നത് — ഈ പോർട്ടലുകളുമായി ഞങ്ങൾക്ക് യാതൊരു ബന്ധവുമില്ല, ജോലി ലഭ്യതയോ പ്രതികരണനിരക്കോ വിസ ഫലങ്ങളോ ഞങ്ങൾക്ക് ഉറപ്പുനൽകാൻ കഴിയില്ല.
                      </p>
                      <p className="mb-2 font-medium text-slate-700">ഈ സുരക്ഷാ കാര്യങ്ങൾ ശ്രദ്ധിക്കുക:</p>
                      <ul className="list-disc pl-5 space-y-2">
                          <li>റിക്രൂട്ട്‌മെന്റ് എപ്പോഴും ഉദ്യോഗാർത്ഥികൾക്ക് സൗജന്യമാണ്. Randstad, Adecco, Manpower പോലുള്ള സ്റ്റാഫിംഗ് ഏജൻസികൾക്ക് ശമ്പളം നൽകുന്നത് നിയമിക്കുന്ന കമ്പനിയാണ്, ജോലി തേടുന്നവരല്ല. ഈ ഏജൻസികളിലൂടെ ജോലി ലഭിക്കാൻ "രജിസ്ട്രേഷൻ ഫീസ്," "പ്രോസസിംഗ് ഫീസ്," അല്ലെങ്കിൽ "വിസ ഫീസ്" ആവശ്യപ്പെട്ടാൽ അത് തട്ടിപ്പാണ്.</li>
                          <li>"ഗ്യാരണ്ടീഡ് ജോലി" അല്ലെങ്കിൽ "ഗ്യാരണ്ടീഡ് വിസ സ്പോൺസർഷിപ്പ്" വാഗ്ദാനം ചെയ്യുന്ന ആർക്കും പണം നൽകരുത്. യഥാർത്ഥ തൊഴിലുടമകളും സർക്കാർ പദ്ധതികളും ഇതിന് ജോലി തേടുന്നവരിൽ നിന്ന് പണം ഈടാക്കില്ല.</li>
                          <li>വിസയും വർക്ക് പെർമിറ്റ് നിയമങ്ങളും ഓരോ രാജ്യത്തിന്റെയും സർക്കാരാണ് നിശ്ചയിക്കുന്നത്, ജോബ് പോർട്ടലുകൾ അല്ല. എപ്പോഴും ആ രാജ്യത്തിന്റെ ഔദ്യോഗിക ഇമിഗ്രേഷൻ വെബ്സൈറ്റിൽ ആവശ്യകതകൾ പരിശോധിച്ചുറപ്പിക്കുക.</li>
                          <li>WhatsApp, Telegram, അല്ലെങ്കിൽ അനൗദ്യോഗിക വെബ്സൈറ്റുകളിലൂടെ പ്രചരിക്കുന്ന "വിസ സ്പോൺസർഷിപ്പോടു കൂടിയ അവിദഗ്ധ/തൊഴിലാളി ജോലി" വാഗ്ദാനങ്ങളിൽ പ്രത്യേകം ജാഗ്രത പുലർത്തുക — ഈ മേഖലയിൽ ജോലി തേടുന്നവരെ ലക്ഷ്യമിട്ടുള്ള ധാരാളം തട്ടിപ്പുകൾ നടക്കുന്നുണ്ട്.</li>
                          <li>എപ്പോഴും കമ്പനിയുടെയോ ഏജൻസിയുടെയോ ഔദ്യോഗിക വെബ്സൈറ്റ് വഴി (ഉദാ: randstad.com, adecco.com) അപേക്ഷിക്കുക — WhatsApp-ലോ Telegram-ലോ "റിക്രൂട്ടർ" ആണെന്ന് അവകാശപ്പെടുന്ന ആരെങ്കിലും അയച്ച ലിങ്ക് വഴിയല്ല.</li>
                          <li>സംശയമുണ്ടെങ്കിൽ, മൂന്നാം കക്ഷി ഏജന്റുമാരിലൂടെ അല്ലാതെ തൊഴിലുടമയുടെയോ സർക്കാരിന്റെയോ ഔദ്യോഗിക വെബ്സൈറ്റ് വഴി നേരിട്ട് അപേക്ഷിക്കുക.</li>
                      </ul>
                  </>
              )}
          </Disclosure>
            <h1 className="text-2xl font-semibold text-slate-800 mb-2">Apply for Jobs</h1>
            <p className="text-slate-500 mb-8">
                A curated list of job portals to apply directly. This section is exclusively for clients who've booked a Europass CV with us — enter your access password to unlock the links.
            </p>

            {loading ? (
                <p className="text-slate-500">Loading...</p>
            ) : portals.length === 0 ? (
                <p className="text-slate-500">No job portals added yet.</p>
            ) : (
                <div className="space-y-3">
                    {portals.map((p) => (
                        <div key={p._id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-center justify-between gap-4">
                            <div>
                                <p className="font-medium text-slate-800">{p.name}</p>
                                {p.country && <p className="text-xs text-slate-400">{p.country}</p>}
                                {p.description && <p className="text-sm text-slate-500 mt-1">{p.description}</p>}
                            </div>
                            <button
                                onClick={() => handleApplyClick(p.url)}
                                className="shrink-0 bg-slate-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-700"
                            >
                                Apply
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {showPasswordPrompt && (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-6" onClick={() => setShowPasswordPrompt(false)}>
        <div className="bg-white rounded-2xl max-w-sm w-full p-6 relative" onClick={(e) => e.stopPropagation()}>
            <button
                onClick={() => setShowPasswordPrompt(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-xl leading-none"
                aria-label="Close"
            >
                ✕
            </button>
            <h3 className="font-semibold text-slate-800 mb-2 pr-6">Access Required</h3>
            <p className="text-sm text-slate-500 mb-4">
                This link is exclusively for those holding a Europass CV from EuroCVStudio. Enter the password we provided you.
            </p>
            {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
            <form onSubmit={handleVerify} className="space-y-3">
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Access password"
                    required
                    className="w-full border border-slate-300 rounded-lg px-4 py-2"
                />
                <button type="submit" className="w-full bg-slate-800 text-white py-2 rounded-lg hover:bg-slate-700">
                    Unlock
                </button>
            </form>
        </div>
    </div>
)}
        </div>
    );
}