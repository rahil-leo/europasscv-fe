import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import TemplateCard from "../components/TemplateCard";

function Home() {
  const [featuredTemplates, setFeaturedTemplates] = useState([]);

  useEffect(() => {
    let isMounted = true;

    api.get("/templates")
      .then((res) => {
        if (isMounted) {
          setFeaturedTemplates(res.data.slice(0, 3));
        }
      })
      .catch((err) => console.error("Failed to load templates:", err));

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div
      className="w-full bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
    >
      <div className="bg-slate-900/70">
        <section className="text-white text-center py-32 px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Professional CV Templates, Ready to Book
          </h1>
          <p className="text-lg text-slate-200 mb-8">
            Browse, pick, and book a professional CV template in minutes.
          </p>
          <Link
            to="/templates"
            className="inline-block bg-white text-slate-800 px-6 py-3 rounded-lg font-medium hover:bg-slate-100 transition"
          >
            Browse Templates
          </Link>
        </section>

        <section className="py-16 px-4 max-w-7xl mx-auto bg-white text-black">
          <h2 className="text-2xl font-semibold text-center mb-10">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl mb-2">1</div>
              <p className="font-medium">Browse Templates</p>
            </div>
            <div>
              <div className="text-3xl mb-2">2</div>
              <p className="font-medium">Login & Book</p>
            </div>
            <div>
              <div className="text-3xl mb-2">3</div>
              <p className="font-medium">Get Your Template</p>
            </div>
          </div>
        </section>

        {featuredTemplates.length > 0 && (
          <section className="py-16 px-4 max-w-6xl mx-auto">
            <h2 className="text-2xl font-semibold text-center mb-10 text-white">
              Popular Templates
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredTemplates.map((template) => (
                <TemplateCard key={template._id} template={template} />
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                to="/templates"
                className="inline-block bg-white text-slate-800 px-6 py-3 rounded-lg font-medium hover:bg-slate-100 transition"
              >
                Show More Templates
              </Link>
            </div>
          </section>
        )}

        <section className="text-center py-16 px-4 text-white">
          <h2 className="text-2xl font-semibold mb-4">
            Ready to find your template?
          </h2>
          <Link
            to="/templates"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Browse Now
          </Link>
        </section>

        <section className="py-16 px-4 max-w-7xl mx-auto bg-white text-black">
          <h2 className="text-2xl font-semibold text-center mb-10">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="font-semibold mb-1">Professionally Designed</p>
              <p className="text-sm text-slate-600">
                Clean, modern templates built to stand out.
              </p>
            </div>
            <div>
              <p className="font-semibold mb-1">Quick & Simple</p>
              <p className="text-sm text-slate-600">
                Book a template in just a few clicks.
              </p>
            </div>
            <div>
              <p className="font-semibold mb-1">Wide Variety</p>
              <p className="text-sm text-slate-600">
                Styles for every profession and preference.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
export default Home;