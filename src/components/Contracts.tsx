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
    <div className="min-h-screen w-full">
      <div className="text-white p-4 flex items-center justify-center">
        <h2 className="text-2xl md:text-4xl">Coming Soon!</h2>
      </div>
      
      <div className="px-2 sm:px-4 md:px-8 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {boxes.map((box, index) => (
            <motion.div
              key={box.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedBox(box)}
              className={`bg-white text-black shadow-md rounded-lg overflow-hidden cursor-pointer flex flex-col items-center justify-center border-2 ${borderColors[index]} min-w-[280px] mx-auto w-full max-w-sm`}
            >
              <div className="w-full pt-4 px-2 flex items-center justify-center">
                <Image
                  src={box.image}
                  alt={box.title}
                  width={160}
                  height={160}
                  className="object-contain h-32 w-auto"
                />
              </div>
              <div className="p-3 sm:p-4 w-full text-center">
                <h3 className="text-lg font-semibold mb-2">{box.title}</h3>
                <ul className="text-black mx-2 sm:mx-4 list-none text-left space-y-2">
                  {box.description.map((desc, index) => {
                    const isLast = index === box.description.length - 1;
                    return (
                      <li key={index} className="text-sm sm:text-base">
                        {isLast ? <span className="font-semibold">{desc}</span> : desc}
                      </li>
                    );
                  })}
                </ul>
                <Link href="/contactus" className="block mt-4">
                  <button className="wave-button w-full sm:w-auto px-4 py-2">
                    Let&apos;s Deal
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {selectedBox && (
          <Dialog open={!!selectedBox} onOpenChange={() => setSelectedBox(null)}>
            <DialogContent className="text-black w-[90%] max-w-[425px] h-auto max-h-[80vh] overflow-y-auto">
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
                className="bg-white rounded-xl shadow-2xl p-3 sm:p-6"
              >
                <div className="relative w-full aspect-video">
                  <Image
                    src={selectedBox.image}
                    alt={selectedBox.title}
                    fill
                    className="rounded-lg object-contain"
                  />
                </div>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default Contracts;