"use client"

import { useEffect, useRef } from "react"
import Chart from "chart.js/auto"

export default function StockChart() {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    // Sample data - in a real app, this would come from your API
    const data = {
      labels: ["Electronics", "Clothing", "Food", "Home", "Books", "Others"],
      datasets: [
        {
          label: "Stock Levels by Category",
          data: [65, 59, 80, 81, 56, 55],
          backgroundColor: [
            "rgba(20, 83, 45, 0.8)", // Darker green
            "rgba(34, 197, 94, 0.7)", // Medium green
            "rgba(134, 239, 172, 0.7)", // Light green
            "rgba(187, 247, 208, 0.7)", // Very light green
            "rgba(240, 253, 244, 0.7)", // Almost white green
            "rgba(220, 252, 231, 0.7)", // Pale green
          ],
          borderColor: [
            "rgba(20, 83, 45, 1)",
            "rgba(34, 197, 94, 1)",
            "rgba(134, 239, 172, 1)",
            "rgba(187, 247, 208, 1)",
            "rgba(240, 253, 244, 1)",
            "rgba(220, 252, 231, 1)",
          ],
          borderWidth: 1,
        },
      ],
    }

    // Destroy previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // Create the chart
    const ctx = chartRef.current.getContext("2d")
    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Quantity",
            },
          },
          x: {
            title: {
              display: true,
              text: "Category",
            },
          },
        },
      },
    })

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [])

  return (
    <div className="h-72">
      <canvas ref={chartRef}></canvas>
    </div>
  )
}
