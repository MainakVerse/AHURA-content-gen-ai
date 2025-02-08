'use client'
import Link from 'next/link';
import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import {
  Startup,
  MidTier,
  BigCorp

} from "@/assets";

type BoxItem = {
  id: number;
  image: any;
  title: string;
  description: string[];
};

const images = [
  Startup,
  MidTier,
  BigCorp
];


const Contracts: React.FC = () => {
  const [selectedBox, setSelectedBox] = useState<BoxItem | null>(null);

  const boxes: BoxItem[] = [
    {
      id: 1,
      image: images[0],
      title: "Startups",
      description: [
        "Get started with baby steps",
        "Handle 7000 request per day",
        "Customized private tool setup for the company",
        "Starts from ₹ 3500 / mo",

      ],

    },
    {
      id: 2,
      image: images[1],
      title: "Mid Tier Enterprises",
      description: [
        "Handle 10000 API requests per day",
        "Customized tool setup for the company",
        "Priority Support",
        "Starts from ₹ 7000 / mo"
      ]
    },
    {
      id: 3,
      image: images[2],
      title: "Big Companies",
      description: [
        "Handle unlimited API requests per day",
        "Customized setup for the company",
        "Direct pass to golden membership",
        "Starts from ₹ 20000 / mo"
      ]
    },

  ];

  const borderColors = ['border-red-500', 'border-green-500', 'border-blue-500'];

  return (
    <>
      <div className="text-white p-4 sm:p-6 md:p-8 flex items-center justify-center">
        <h2 className='text-4xl'>Coming Soon!</h2>
      </div>
      <div className="p-4 sm:p-6 md:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {boxes.map((box, index) => (
            <motion.div
              key={box.id}
              whileHover={{ scale: 1.05 }}
              onClick={() => setSelectedBox(box)}
              className={`bg-white text-black shadow-md rounded-lg overflow-hidden cursor-pointer flex flex-col items-center justify-center border-2 ${borderColors[index]}`}
            >
              <div className="aspect-w-16 aspect-h-9 mt-4 flex items-center justify-center">
                <Image
                  src={box.image}
                  alt={box.title}
                  width={200}
                  height={200}
                  className="object-cover"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-base sm:text-lg font-semibold">{box.title}</h3>
                <ul className="text-black m-10 list-none text-left">
                  {box.description.map((desc, index) => {
                    const isLast = index === box.description.length - 1;
                    return (
                      <li key={index} className="mb-1">
                        {isLast ? <span className="font-semibold">{desc}</span> : desc}
                      </li>
                    );
                  })}
                </ul>
                <Link href="/contactus"><button className="wave-button">Let&apos;s Deal</button></Link>
              </div>
            </motion.div>
          ))}
        </div>

        {selectedBox && (
          <Dialog open={!!selectedBox} onOpenChange={() => setSelectedBox(null)}>
            <DialogContent className="text-black w-[95%] h-[50%] max-w-[425px]">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                whileHover={{
                  rotateX: 10,
                  rotateY: -10,
                  scale: 1.02
                }}
                style={{ transformStyle: 'preserve-3d' }}
                className="bg-white rounded-xl shadow-2xl p-4 sm:p-6"
              >


                <div className="aspect-w-16 aspect-h-9 mt-4">
                  <Image
                    src={selectedBox.image}
                    alt={selectedBox.title}
                    fill
                    className="rounded-lg object-cover"
                  />
                </div>


              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </>
  );
};

export default Contracts
