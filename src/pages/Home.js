import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import TemplateCard from "../components/TemplateCard";
import TrustStats from "../components/TrustStats";
import TestimonialsSection from "../components/TestimonialsSection";
import FaqSection from "../components/FaqSection";

function Home() {
  const [featuredTemplates, setFeaturedTemplates] = useState([]);
  const [ourWork, setOurWork] = useState([]);

  useEffect(() => {
    let isMounted = true;

    api.get("/templates")
      .then((res) => {
        if (isMounted) {
          setFeaturedTemplates(res.data.slice(0, 3));
        }
      })
      .catch((err) => console.error("Failed to load templates:", err));

    api.get("/work")
      .then((res) => {
        if (isMounted) {
          setOurWork(res.data.slice(0, 3));
        }
      })
      .catch((err) => console.error("Failed to load work:", err));

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div
      className="w-full bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
    >
      <div className="bg-slate-900/75 min-h-screen">
        <section className="text-white text-center py-32 px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-md">
            Professional CV Templates, Ready to Book
          </h1>
          <p className="text-lg text-slate-200 mb-8 max-w-2xl mx-auto drop-shadow-sm">
            Browse, pick, and book a professional CV template in minutes to land your dream job faster.
          </p>
          <Link
            to="/templates"
            className="inline-block border-2 border-white text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-white hover:text-slate-900 hover:scale-105 transition shadow-lg"
          >
            Browse Templates
          </Link>
        </section>

        <TrustStats />

        <section className="py-20 px-4 max-w-7xl mx-auto bg-white text-black rounded-3xl -mt-8 relative z-10 shadow-xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-800">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mb-4">1</div>
              <h3 className="font-semibold text-lg mb-2">Browse Templates</h3>
              <p className="text-slate-500 text-sm px-4">Find the perfect design that matches your profession and style.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mb-4">2</div>
              <h3 className="font-semibold text-lg mb-2">Login & Book</h3>
              <p className="text-slate-500 text-sm px-4">Create a quick account and submit your booking request instantly.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mb-4">3</div>
              <h3 className="font-semibold text-lg mb-2">Get Your Template</h3>
              <p className="text-slate-500 text-sm px-4">Our team crafts your custom CV and delivers it ready to send.</p>
            </div>
          </div>
        </section>

        {featuredTemplates.length > 0 && (
          <section className="py-20 px-4 max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-white">
              Popular Templates
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredTemplates.map((template) => (
                <TemplateCard key={template._id} template={template} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                to="/templates"
                className="inline-block border-2 border-white/30 text-white px-8 py-3 rounded-xl font-medium hover:bg-white hover:text-slate-900 transition"
              >
                View All Templates
              </Link>
            </div>
          </section>
        )}

        <section className="py-20 px-4 max-w-7xl mx-auto bg-white text-black rounded-3xl shadow-xl my-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-800">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            <div className="p-6 bg-slate-50 rounded-2xl hover:shadow-md transition">
              <div className="text-4xl mb-4">🎨</div>
              <p className="font-bold text-lg mb-2 text-slate-800">Professionally Designed</p>
              <p className="text-sm text-slate-600">
                Clean, modern templates built to catch recruiters' attention instantly.
              </p>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl hover:shadow-md transition">
              <div className="text-4xl mb-4">⚡</div>
              <p className="font-bold text-lg mb-2 text-slate-800">Quick & Simple</p>
              <p className="text-sm text-slate-600">
                Book a template in just a few clicks. No confusing builders.
              </p>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl hover:shadow-md transition">
              <div className="text-4xl mb-4">💼</div>
              <p className="font-bold text-lg mb-2 text-slate-800">Wide Variety</p>
              <p className="text-sm text-slate-600">
                Styles for every profession, from creative roles to executive positions.
              </p>
            </div>
          </div>
        </section>

        {ourWork.length > 0 && (
          <section className="py-16 px-4 max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-white">Our Work in Action</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ourWork.map((w) => (
                      <div key={w._id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:-translate-y-1 transition duration-300">
                          <img src={w.imageUrl} alt={w.title} className="w-full h-auto object-cover border-b border-slate-100" loading="lazy" />
                          <div className="p-5">
                              <p className="font-semibold text-slate-800">{w.title}</p>
                          </div>
                      </div>
                  ))}
              </div>
              <div className="text-center mt-12">
                  <Link to="/our-work" className="inline-block border-2 border-white/30 text-white px-8 py-3 rounded-xl font-medium hover:bg-white hover:text-slate-900 transition">
                      See More of Our Work
                  </Link>
              </div>
          </section>
        )}

        <TestimonialsSection />

        <section className="text-center py-20 px-4 text-white bg-blue-600 mx-4 md:mx-auto max-w-6xl rounded-3xl my-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white opacity-10 blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-900 opacity-20 blur-3xl pointer-events-none"></div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">
            Ready to secure your next interview?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto relative z-10">
            Stop worrying about formatting and let our templates do the heavy lifting for you.
          </p>
          <Link
            to="/templates"
            className="inline-block bg-white text-blue-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 hover:scale-105 transition shadow-lg relative z-10"
          >
            Browse Templates Now
          </Link>
        </section>

        <FaqSection />

      </div>
    </div>
  );
}
export default Home;