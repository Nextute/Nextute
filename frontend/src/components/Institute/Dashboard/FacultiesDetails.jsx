import React from 'react'
import { FiUpload } from "react-icons/fi";

const FacultiesDetails = () => {
  return (
    <div className='grid grid-cols-3 bg-[#E6EEE3] border-1 border-black rounded-3xl p-5 gap-4'>
        <div className='bg-white border-1 border-black rounded-xl p-4'>
            <h4 className='text-base font-semibold'>First Name</h4>
            <input className='outline-none border-none' type="text" />
        </div>
        <div className='bg-white border-1 border-black rounded-xl p-4'>
            <h4 className='text-base font-semibold'>Middle Name</h4>
            <input className='outline-none border-none' type="text" />
        </div>
        <div className='bg-white border-1 border-black rounded-xl p-4'>
            <h4 className='text-base font-semibold'>Last Name</h4>
            <input className='outline-none border-none' type="text" />
        </div>
        <div className='bg-white border-1 border-black rounded-xl p-4'>
            <h4 className='text-base font-semibold'>Gender</h4>
            <input className='outline-none border-none' type="text" />
        </div>
        <div className='bg-white border-1 border-black rounded-xl p-4'>
            <h4 className='text-base font-semibold'>Contact</h4>
            <input className='outline-none border-none' type="text" />
        </div>
        <div className='bg-white border-1 border-black rounded-xl p-4'>
            <h4 className='text-base font-semibold'>Email</h4>
            <input className='outline-none border-none' type="email" />
        </div>
        <div className='bg-white border-1 border-black rounded-xl p-4'>
            <h4 className='text-base font-semibold'>Subject Teaches</h4>
            <input className='outline-none border-none' type="text" />
        </div>
        <div className='bg-white border-1 border-black rounded-xl p-4'>
            <h4 className='text-base font-semibold'>Year of Experience</h4>
            <input className='outline-none border-none' type="text" />
        </div>
        <div className='relative row-span-3 bg-white border-1 border-black rounded-xl p-4'>
            <h4 className='text-base font-semibold'>Upload Photo</h4>
            <p className='text-sm text-gray-500'>PNG/JPEG</p>
            <span className="absolute top-[68%] left-3/4 -translate-x-1/2 -translate-y-1/2 text-black text-2xl sm:text-3xl sm:top-1/2 sm:left-1/2  md:text-5xl flex justify-center items-center"><FiUpload /></span>
        </div>
        <div className='bg-white border-1 border-black rounded-xl p-4'>
            <h4 className='text-base font-semibold'>Highest Qualification</h4>
            <input className='outline-none border-none' type="text" />
        </div>
        <div className='bg-white border-1 border-black rounded-xl p-4'>
            <h4 className='text-base font-semibold'>Current Salary(Optional)</h4>
            <input className='outline-none border-none' type="text" />
        </div>
        <label className='col-span-2 text-xl items-center mt-3 ml-2'>
            <input className='mr-5 scale-150' type="checkbox" />
            I declare all information provided by me is correct.
            <button className='bg-white text-[#1B3431] border-1 border-[#489b7b] rounded-full px-7 py-1 ml-32'>ADD</button>
        </label>
    </div>
  )
}

export default FacultiesDetails