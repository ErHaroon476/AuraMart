export default function Footer() {
  return (
    <footer className="bg-orange-900 text-orange-100 mt-12 rounded-t-2xl shadow-lg">
      <div className="container mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        {/* Brand & Trust */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-white">
            <span className="text-orange-400">AA</span>Mart
          </h2>
          <p className="text-sm text-orange-200">
            Your trusted source for premium cosmetics and skincare.
          </p>
          <p className="text-xs">
            100% Original • Dermatologist Approved • Customer Satisfaction Guaranteed
          </p>
        </div>

        {/* Contact Section */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">Get in Touch</h3>
          <p className="text-sm">Have questions or need help? We’re just an email away.</p>
          <a
            href="mailto:haroonnasim033@gmail.com"
            className="inline-block bg-orange-600 hover:bg-orange-500 text-white text-sm font-medium px-5 py-2 rounded-full shadow-md transition-colors duration-200"
          >
            📩 Contact Us
          </a>
        </div>

        {/* Rights */}
        <div className="flex flex-col items-center md:items-end justify-center space-y-2">
          <p className="text-sm text-orange-200">Trusted by thousands of beauty lovers</p>
          <p className="text-xs text-orange-300">
            © {new Date().getFullYear()} AA Mart. All rights reserved.
          </p>
          {/* Developer Credit */}
          <a
            href="https://haroon-nasim.netlify.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-orange-400 hover:text-orange-300 transition-colors duration-200 underline"
          >
            Developed by Haroon Naseem
          </a>
        </div>
      </div>
    </footer>
  );
}
