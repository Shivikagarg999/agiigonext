import { 
  FaFacebookF, FaTwitter, FaInstagram, 
  FaPhoneAlt, FaEnvelope, FaMapMarkerAlt 
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-200 text-gray-800 px-4 sm:px-6 py-12 border-t border-gray-200">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Brand Section */}
        <div className="space-y-5">
          <div className="flex items-center">
            <img src="/images/logo-bgr.png" alt="Agiigo Logo" className="h-10" />
          </div>
          
          <p className="text-gray-600 text-sm leading-relaxed">
            Our vision is to provide convenience and help increase your sales business.
          </p>
          
          <div className="flex space-x-3">
            {[
              { icon: FaFacebookF, link: "https://www.facebook.com/people/Agiigocom/61574947863550/#" },
              { icon: FaTwitter, link: "https://twitter.com" },
              { icon: FaInstagram, link: "https://www.instagram.com/agiigo.ae/#" }
            ].map((social, index) => (
              <a 
                key={index} 
                href={social.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-white p-2.5 rounded-full shadow-sm text-gray-600 hover:bg-[#EB8426] hover:text-white transition-colors duration-200"
              >
                <social.icon className="text-sm" />
              </a>
            ))}
          </div>
        </div>

       {/* Navigation Section */}
<div className="space-y-4">
  <h3 className="text-lg font-semibold text-gray-900">Navigation</h3>
  <ul className="space-y-2.5">
    {["Home", "Shop", "About"].map((item, index) => {
      const path = item === "Home" ? "/" : `/${item.toLowerCase()}`;
      return (
        <li key={index}>
          <a 
            href={path}
            className="text-gray-600 hover:text-[#EB8426] text-sm transition-colors duration-200"
          >
            {item}
          </a>
        </li>
      );
    })}
  </ul>
</div>


        {/* Account Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Account</h3>
          <ul className="space-y-2.5">
            {["My account", "Login/Register", "Cart"].map((acc, index) => (
              <li key={index}>
                <a 
                  href="#" 
                  className="text-gray-600 hover:text-[#EB8426] text-sm transition-colors duration-200"
                >
                  {acc}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Contact</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <FaMapMarkerAlt className="mt-0.5 mr-3 text-[#EB8426] text-sm flex-shrink-0" />
              <span className="text-gray-600 text-sm">Dubai HQ</span>
            </li>
            
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-7xl mx-auto border-t border-gray-200 my-8"></div>

      {/* Bottom Section */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm">
        {/* Copyright */}
        <p className="text-gray-500 text-xs md:text-sm mb-4 md:mb-0">
          © {new Date().getFullYear()} Agiigo. All rights reserved.
        </p>
        
        {/* Legal Links */}
        <div className="flex space-x-4">
          {["Privacy Policy", "Terms & Conditions"].map((item, index) => (
            <a 
              key={index} 
              href="#" 
              className="text-gray-500 hover:text-[#EB8426] text-xs md:text-sm transition-colors duration-200"
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
