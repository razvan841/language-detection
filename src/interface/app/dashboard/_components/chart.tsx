"use client"
import React from 'react'
import { Pie } from 'react-chartjs-2'
import {Chart, ArcElement, Tooltip, Legend} from 'chart.js'
Chart.register(ArcElement, Tooltip, Legend);

import Database, { Database as DatabaseType } from "better-sqlite3";
import { createTables, getAlarmCountPerUser } from "@/db";


function PieChart({ charData }: {charData: {
    count: number;
    id: string;
    username: string;
}[]}) 
{
const data = charData.map(x => x.count);
const labels = charData.map(x => x.username)
console.log(labels)
console.log(data)
const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: [
          'rgba(67, 233, 187, 0.6)',
          'rgba(70, 188, 96, 0.6)',
          'rgba(188, 122, 249, 0.6)',
          'rgba(255, 161, 245, 0.6)',
          'rgba(1, 196, 204, 0.6)',
        ],
      },
    ],
  };

  return (
    <div className='py-2'>
      <Pie data={chartData} width="350%" height="350%" options={{
        responsive: true,
        maintainAspectRatio: false
    }}/>
    </div>
  );
}

export default PieChart