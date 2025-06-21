import React from "react";
import { FaMapLocationDot } from "react-icons/fa6";

const Contact = () => {
  return (
    <div className="bg-[#E6EEE3] border-1 border-black rounded-2xl p-4 gap-4">
      <section className="grid grid-cols-11 gap-3 mb-5">
        <div className="col-span-8 bg-white border-1 border-black rounded-xl p-3 pb-1">
          <h4 className="text-lg font-semibold">Head Office Address</h4>
          <textarea
            className="w-full leading-tight text-base text-black resize-none outline-none"
            type="text"
            rows="3"
            placeholder="Address of your main center"
          />
        </div>
        <input
          className="col-span-2 text-lg font-semibold bg-white border-1 border-black outline-none rounded-xl px-4 py-2"
          type="text"
          placeholder="State"
        />
        <input
          className="col-span-2 text-lg font-semibold bg-white border-1 border-black outline-none rounded-xl px-4 py-2"
          type="text"
          placeholder="City"
        />
        <input
          className="col-span-2 text-lg font-semibold bg-white border-1 border-black outline-none rounded-xl px-4 py-2"
          type="text"
          placeholder="Pin Code"
        />
        <input
          className="col-span-2 text-lg font-semibold bg-white border-1 border-black outline-none rounded-xl px-4 py-2"
          type="text"
          placeholder="Landmark"
        />

        <div className="col-span-3 row-span-2 col-start-9 row-start-1 bg-[#A0CD88] rounded-xl p-3 ml-5">
          <h3 className="text-4xl">Location</h3>
          <FaMapLocationDot />
        </div>
      </section>
      <section className="grid grid-cols-11 gap-3">
        <div className="col-span-8 bg-white border-1 border-black rounded-xl p-3 pb-1">
          <h4 className="text-lg font-semibold">Branch Address(If any)</h4>
          <textarea
            className="w-full leading-tight text-base text-black resize-none outline-none"
            type="text"
            rows="3"
            placeholder="Address of your branch"
          />
        </div>
        <input
          className="col-span-2 text-lg font-semibold bg-white border-1 border-black outline-none rounded-xl px-4 py-2 mb-5"
          type="text"
          placeholder="State"
        />
        <input
          className="col-span-2 text-lg font-semibold bg-white border-1 border-black outline-none rounded-xl px-4 py-2 mb-5"
          type="text"
          placeholder="City"
        />
        <input
          className="col-span-2 text-lg font-semibold bg-white border-1 border-black outline-none rounded-xl px-4 py-2 mb-5"
          type="text"
          placeholder="Pin Code"
        />
        <input
          className="col-span-2 text-lg font-semibold bg-white border-1 border-black outline-none rounded-xl px-4 py-2 mb-5"
          type="text"
          placeholder="Landmark"
        />

        <div className="col-span-3 row-span-2 col-start-9 row-start-1 bg-[#A0CD88] rounded-xl p-3 ml-5">
          <h3 className="text-4xl">Location</h3>
          <FaMapLocationDot />
        </div>
        <input
          className="col-span-3 text-lg font-semibold bg-white border-1 border-black outline-none rounded-xl px-4 py-2"
          type="text"
          placeholder="Phone No."
        />
        <input
          className="col-span-3 text-lg font-semibold bg-white border-1 border-black outline-none rounded-xl px-4 py-2"
          type="text"
          placeholder="WhatsApp No."
        />
        <input
          className="col-span-5 text-lg font-semibold bg-white border-1 border-black outline-none rounded-xl px-4 py-2"
          type="email"
          placeholder="Email"
        />
      </section>
    </div>
  );
};

export default Contact;
