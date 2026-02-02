export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-800 bg-slate-950/95 text-slate-200">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10 md:grid md:grid-cols-3 md:text-left text-center">
        {/* Brand & Trust */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-50">
            <span className="text-emerald-400">Aura</span>Mart
          </h2>
          <p className="text-sm text-slate-400">
            Your trusted source for premium cosmetics and skincare.
          </p>
          <p className="text-xs text-slate-500">
            100% Original • Dermatologist Approved • Customer Satisfaction
            Guaranteed
          </p>
        </div>

        {/* Contact Section */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-slate-50">Get in touch</h3>
          <p className="text-sm text-slate-400">
            Have questions or need help? We’re just an email away.
          </p>
          <a
            href="mailto:haroonnasim033@gmail.com"
            className="inline-block rounded-full bg-emerald-600 px-5 py-2 text-sm font-medium text-white shadow-md transition-colors duration-200 hover:bg-emerald-500"
          >
            📩 Contact Us
          </a>

          {/* Shop Address */}
          <div className="mt-4 space-y-1 text-sm text-slate-400">
            <p className="font-semibold text-slate-50">🏬 AA Traders</p>
            <p>Gol Chowk, D Block, Street 3</p>
            <p>Main Bazaar, Okara</p>
            <p>📞 044-2527657</p>
          </div>
        </div>

        {/* Rights */}
        <div className="flex flex-col items-center justify-center space-y-2 md:items-end">
          <p className="text-sm text-slate-400">
            Trusted by thousands of beauty lovers
          </p>
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} AA Mart. All rights reserved.
          </p>
          {/* Developer Credit */}
          <a
            href="https://haroon-nasim.netlify.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-emerald-400 underline transition-colors duration-200 hover:text-emerald-300"
          >
            Developed by Haroon Naseem
          </a>
        </div>
      </div>
    </footer>
  );
}
