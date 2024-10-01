"use client";
import React from 'react';
import Header from '../component/Header';
import Table from '../component/Table';
import { Space_Grotesk } from "next/font/google";

const space_grotesk = Space_Grotesk({
  weight: '700',
  subsets: ['latin'],
})

const Dashboard = () => {
  return (
    <div style={{ border: "1px solid transparent"}}>
      <Header />
      <div className='dashboard boarder rounded shadow-md'>
        <div className='add_invoice_div mb-2'>
          <h1 className={`lg:text-3xl md:text-1xl${space_grotesk.className} text-[#2B83BE]`}>List of Invoices</h1>
        </div>
        <Table />
      </div>
    </div>
  );
};

export default Dashboard;
