import React from "react";
import {
  FaBolt,
  FaPaintRoller,
  FaBroom,
  FaTools,
  FaStar,
  FaCheckCircle,
} from "react-icons/fa";
import { MdPlumbing } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const categories = [
  { name: "Electrician", icon: <FaBolt size={35} /> },
  { name: "Plumber", icon: <MdPlumbing size={35} /> },
  { name: "Cleaning", icon: <FaBroom size={35} /> },
  { name: "Painting", icon: <FaPaintRoller size={35} /> },
  { name: "Carpenter", icon: <FaTools size={35} /> },
];

const services = [
  {
    id: 1,
    title: "Home Cleaning",
    price: "₹499",
    rating: 4.9,
    image: "https://picsum.photos/400/250?1",
  },
  {
    id: 2,
    title: "Electric Repair",
    price: "₹699",
    rating: 4.8,
    image: "https://picsum.photos/400/250?2",
  },
  {
    id: 3,
    title: "Plumbing",
    price: "₹599",
    rating: 4.7,
    image: "https://picsum.photos/400/250?3",
  },
];

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="bg-slate-50">
      <section className="bg-slate-800 text-white py-24">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-5xl font-bold leading-tight">
              Find Trusted Service Professionals
            </h1>
            <p className="mt-6 text-slate-300 text-lg">
              Book verified electricians, plumbers, cleaners and more in just a
              few clicks.
            </p>

            <div className="mt-8 flex gap-4">
              <button className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg">
                Explore Services
              </button>

              <button
                onClick={() =>
                  navigate("/login", { state: { role: "VENDOR" } })
                }
                className="border border-white px-6 py-3 rounded-lg hover:bg-white hover:text-slate-900 transition duration-300"
              >
                Become Vendor
              </button>
            </div>
          </div>
          <img
            src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800"
            alt=""
            className="rounded-2xl shadow-2xl"
          />
        </div>
      </section>
      <section className="max-w-7xl mx-auto py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-10">
          Popular Categories
        </h2>

        <div className="grid md:grid-cols-5 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="bg-white rounded-xl shadow hover:shadow-xl hover:-translate-y-2 duration-300 p-8 text-center"
            >
              <div className="text-indigo-600 flex justify-center mb-4">
                {cat.icon}
              </div>

              <h3 className="font-semibold">{cat.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Services */}

      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10">
            Featured Services
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="rounded-xl overflow-hidden shadow-lg hover:shadow-2xl duration-300 bg-white"
              >
                <img
                  src={service.image}
                  className="h-56 w-full object-cover"
                  alt=""
                />

                <div className="p-5">
                  <h3 className="font-bold text-xl">{service.title}</h3>

                  <div className="flex justify-between mt-4">
                    <span className="font-bold text-indigo-600">
                      {service.price}
                    </span>

                    <span className="flex items-center gap-1">
                      <FaStar className="text-yellow-500" />
                      {service.rating}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      navigate("/login", { state: { role: "CUSTOMER" } })
                    }
                    className="mt-5 w-full bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-lg"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}

      <section className="py-16 bg-slate-100">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10">
            Why Choose Us
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              "Verified Vendors",
              "Secure Payments",
              "Fast Booking",
              "24x7 Support",
            ].map((item) => (
              <div
                key={item}
                className="bg-white rounded-xl p-6 shadow text-center"
              >
                <FaCheckCircle className="text-green-500 mx-auto text-4xl mb-4" />

                <h3 className="font-semibold">{item}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}

      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10">
            Happy Customers
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow">
              <p className="italic">
                "Amazing experience. Booking was easy and the service was
                excellent."
              </p>

              <h4 className="mt-5 font-bold">John Doe</h4>
            </div>

            <div className="bg-white p-8 rounded-xl shadow">
              <p className="italic">
                "Very professional vendors. Highly recommended."
              </p>

              <h4 className="mt-5 font-bold">Sarah Smith</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}

      <footer className="bg-slate-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between">
          <h2 className="text-2xl font-bold text-indigo-400">ServiceHub</h2>

          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="/">Home</a>
            <a href="/">About</a>
            <a href="/">Services</a>
            <a href="/">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
