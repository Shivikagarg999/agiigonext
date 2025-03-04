export default function Features() {
    const features = [
      {
        title: "Wide Product Selection",
        description: "Explore a diverse range of products at unbeatable prices.",
        image: "https://images.unsplash.com/photo-1530745342582-0795f23ec976?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8d2lkZSUyMHByb2R1Y3RzJTIwc2VsZWN0aW9ufGVufDB8fDB8fHww", 
      },
      {
        title: "Exclusive Deals & Discounts",
        description: "Enjoy daily deals, flash sales, and member-only offers.",
        image: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGVhbHMlMjBhbmQlMjBkaXNjb3VudHN8ZW58MHx8MHx8fDA%3D", 
      },
      {
        title: "Reliable Customer Support",
        description: "24/7 assistance to ensure a hassle-free shopping experience.",
        image: "/images/customer-support.jpg", 
      },
    ];
  
    return (
      <div className="flex flex-wrap justify-center gap-6 p-6">
        {features.map((feature, index) => (
          <div key={index} className="bg-gray-100 rounded-2xl shadow-md pt-10 pb-10 pr-5 pl-5 flex items-center space-x-4 w-96">
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="text-gray-600 text-sm mt-2">{feature.description}</p>
            </div>
            <div className="w-32 h-32 overflow-hidden rounded-full">
              <img src={feature.image} alt={feature.title} className="w-full h-full object-cover" />
            </div>
          </div>
        ))}
      </div>
    );
  }  