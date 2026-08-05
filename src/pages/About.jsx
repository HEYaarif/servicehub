import React from "react";
import {
  FaUsers,
  FaTools,
  FaHandshake,
  FaAward,
  FaBullseye,
  FaEye,
} from "react-icons/fa";

export default function About() {
  return (
    <div className="bg-slate-50">
      <section className="bg-slate-800 text-white py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6">About ServiceHub</h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            We connect customers with trusted professionals for home and
            business services through a secure, reliable and easy-to-use
            platform.
          </p>
        </div>
      </section>
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <img
            src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800"
            alt=""
            className="rounded-2xl shadow-xl"
          />
          <div>
            <h2 className="text-4xl font-bold text-slate-800 mb-6">
              Our Story
            </h2>
            <p className="text-slate-600 leading-8">
              ServiceHub was created with one simple goal: making it easier for
              people to find skilled and verified professionals for everyday
              services.
            </p>
            <p className="text-slate-600 leading-8 mt-5">
              Whether it's plumbing, electrical work, home cleaning, painting or
              appliance repair, we make booking trusted professionals quick,
              transparent and hassle-free.
            </p>
          </div>
        </div>
      </section>
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-8">
          <div className="bg-slate-100 rounded-xl p-8 shadow">
            <FaBullseye className="text-indigo-600 text-5xl mb-5" />
            <h3 className="text-2xl font-bold mb-4">Our Mission</h3>

            <p className="text-slate-600 leading-7">
              To provide a seamless platform where customers can book trusted
              services while empowering local professionals with more
              opportunities.
            </p>
          </div>

          <div className="bg-slate-100 rounded-xl p-8 shadow">
            <FaEye className="text-indigo-600 text-5xl mb-5" />

            <h3 className="text-2xl font-bold mb-4">Our Vision</h3>

            <p className="text-slate-600 leading-7">
              To become India's most trusted digital marketplace for home and
              professional services.
            </p>
          </div>
        </div>
      </section>
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">
            Why Choose Us
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:-translate-y-2 duration-300">
              <FaUsers className="text-5xl text-indigo-600 mx-auto mb-5" />

              <h3 className="font-bold text-xl">Verified Vendors</h3>

              <p className="text-slate-500 mt-3">
                Every professional is verified before joining.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:-translate-y-2 duration-300">
              <FaHandshake className="text-5xl text-indigo-600 mx-auto mb-5" />

              <h3 className="font-bold text-xl">Trusted Platform</h3>

              <p className="text-slate-500 mt-3">
                Thousands of satisfied customers trust us.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:-translate-y-2 duration-300">
              <FaTools className="text-5xl text-indigo-600 mx-auto mb-5" />

              <h3 className="font-bold text-xl">Skilled Experts</h3>

              <p className="text-slate-500 mt-3">
                Experienced professionals for every service.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:-translate-y-2 duration-300">
              <FaAward className="text-5xl text-indigo-600 mx-auto mb-5" />

              <h3 className="font-bold text-xl">Quality Service</h3>

              <p className="text-slate-500 mt-3">
                Delivering excellence with every booking.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-slate-900 py-20 text-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-8 text-center">
          <div>
            <h2 className="text-5xl font-bold text-indigo-400">500+</h2>
            <p className="mt-3">Verified Vendors</p>
          </div>

          <div>
            <h2 className="text-5xl font-bold text-indigo-400">10K+</h2>
            <p className="mt-3">Happy Customers</p>
          </div>

          <div>
            <h2 className="text-5xl font-bold text-indigo-400">15K+</h2>
            <p className="mt-3">Completed Bookings</p>
          </div>

          <div>
            <h2 className="text-5xl font-bold text-indigo-400">4.9★</h2>
            <p className="mt-3">Average Rating</p>
          </div>
        </div>
      </section>

      {/* Team */}

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">
            Meet Our Team
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-2xl duration-300"
              >
                <img
                  src={`https://i.pravatar.cc/200?img=${item + 10}`}
                  alt=""
                  className="w-32 h-32 rounded-full mx-auto mb-5"
                />

                <h3 className="text-xl font-bold">Team Member {item}</h3>

                <p className="text-indigo-600">Full Stack Developer</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}

      <section className="bg-indigo-600 py-20 text-white">
        <div className="max-w-5xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Book Your Next Service?
          </h2>

          <p className="text-lg mb-8">
            Join thousands of happy customers and experience hassle-free service
            booking.
          </p>

          <button className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-slate-200 duration-300">
            Explore Services
          </button>
        </div>
      </section>
    </div>
  );
}
