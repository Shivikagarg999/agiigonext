
import { 
  FaFacebookF, FaTwitter, FaInstagram, 
  FaPhoneAlt, FaEnvelope, FaMapMarkerAlt 
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-white text-black px-6 py-10">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between space-y-10 md:space-y-0 md:space-x-10">
        
        {/* Left Section - Logo + Vision + Social Links */}
        <div className="w-full md:w-1/3">
          {/* <img src={Logo} alt="VahanHelp Logo" className="h-16" /> */}
          
        <h2 className="text-[#EB8426] font-semibold text-4xl">
          <img src="/images/logo.jpg" className="h-8"></img>
        </h2>
          <p className="text-[16px] mt-4">
            Our vision is to provide convenience and help increase your sales business.
          </p>
          <div className="flex space-x-4 mt-6">
            {[
              { icon: FaFacebookF, link: "https://facebook.com" },
              { icon: FaTwitter, link: "https://twitter.com" },
              { icon: FaInstagram, link: "https://instagram.com" }
            ].map((social, index) => (
              <a 
                key={index} 
                href={social.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-white p-3 rounded-full shadow-md transition-all duration-300 hover:bg-[#EB8426]"
              >
                <social.icon className="text-black text-lg" />
              </a>
            ))}
          </div>
        </div>

        {/* Right Section - Navigation, Services, Contact */}
        <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 text-left">
          
          {/* Navigation Section */}
          <div>
            <h3 className="font-semibold text-lg">Navigation</h3>
            <div className="flex flex-col space-y-3 mt-2">
              {["Home", "Shop", "About", "Contact"].map((item, index) => (
                <a 
                  key={index} 
                  href="#" 
                  className="text-[16px] text-black transition-all duration-300 hover:text-[#EB8426] p-1 rounded"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Account Section */}
          <div>
            <h3 className="font-semibold text-lg">Account</h3>
            <div className="flex flex-col space-y-3 mt-2">
              {["My account", "Login/Register", "Cart"].map((acc, index) => (
                <a 
                  key={index} 
                  href="#" 
                  className="text-[16px] text-black transition-all duration-300 hover:text-[#EB8426] p-1 rounded"
                >
                  {acc}
                </a>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div>
             
          <div className="mt-4 flex items-center">
  <FaMapMarkerAlt className="mr-2 text-[#EB8426]" />
  <p className="text-[13px] transition-all duration-300 hover:text-[#EB8426] p-1 rounded">
    Dubai HQ
  </p>
</div>

{/* Contact Number */}
<div className="mt-4 flex items-center">
  <FaPhoneAlt className="text-[#EB8426] mr-2" />
  <a 
    href="tel:+971588588466" 
    className="text-[13px] transition-all duration-300 hover:text-[#EB8426] p-1 rounded"
  >
    +97158572631
  </a>
</div>

{/* Email */}
<div className="mt-2 flex items-center">
  <FaEnvelope className="text-[#EB8426] mr-2" />
  <a 
    href="mailto:info@getnotmuch.com" 
    className="text-[13px] transition-all duration-300 hover:text-[#EB8426] p-1 rounded"
  >
    info@getnotmuch.com
  </a>
</div>

          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-400 my-6"></div>

      {/* Bottom Section */}
      <div className="flex flex-col md:flex-row justify-between items-center text-sm px-5">
        
        {/* Left - Copyright */}
        <p>© {new Date().getFullYear()} Agiigo. All rights reserved.</p>

        {/* Right - Links */}
        <div className="flex space-x-6 mt-4 md:mt-0">
          {["Privacy Policy", "Terms & Conditions"].map((item, index) => (
            <a 
              key={index} 
              href="#" 
              className="text-[16px] text-black transition-all duration-300 hover:text-[#EB8426] p-1 rounded"
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}