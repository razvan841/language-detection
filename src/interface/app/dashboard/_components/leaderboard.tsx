"use client"
import React from 'react'
import { Pie } from 'react-chartjs-2'
import {Chart, ArcElement, Tooltip, Legend} from 'chart.js'
Chart.register(ArcElement, Tooltip, Legend);

import Database, { Database as DatabaseType } from "better-sqlite3";
import { createTables, getAlarmCountPerUser } from "@/db";


function LeaderBoard({ charData }: {charData: {
    count: number;
    id: string;
    username: string;
}[]}) 
{
const data = charData.map(x => x.count);
const labels = charData.map(x => x.username);
const leaderboardData = data.splice(0, 5);
const colors = ['rgba(67, 233, 187, 0.6)',
                'rgba(70, 188, 96, 0.6)',
                'rgba(188, 122, 249, 0.6)',
                'rgba(255, 161, 245, 0.6)',
                'rgba(1, 196, 204, 0.6)',]
console.log(data)

  return (
    <div className='py-2 flex flex-col gap-10'>
      

      {leaderboardData.map((count, index) => (
        <div key={index} className='flex gap-10 text-white justify-between px-2 py-1 text-xl font-bold items-center border-black border-2' style={{backgroundColor: colors[index]}}>
        <p>{labels[index]}</p> <p>{count}</p>
              </div>
      ))}
    </div>
  );
}

export default LeaderBoard