"use client";

import React, { useEffect, useState } from "react";
import { companyApiMethods } from "@/services/APImethods/companyAPImethods";

const Page = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await companyApiMethods.sample();
        console.log(res.data);
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRequests();
  }, []);

  return (
    <div className="p-6">
      <h1>Employee Requests Demo</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default Page;
