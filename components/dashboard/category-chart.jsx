"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

export function CategoryChart({ data }) {
  // Convert the category stats object to array format for the chart
  let chartData = [];
  
  if (data && typeof data === 'object') {
    // Handle both object format and array format
    if (Array.isArray(data)) {
      chartData = data.map(item => ({ 
        name: item.category || item.name, 
        value: item.count || item.value || 0 
      }));
    } else {
      chartData = Object.entries(data).map(([name, value]) => ({ name, value }));
    }
  }

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Inventory Distribution</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        {chartData.length > 0 ? (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">No category data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
