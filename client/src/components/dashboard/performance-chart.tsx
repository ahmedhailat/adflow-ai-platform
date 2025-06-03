import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PerformanceChart() {
  const weeklyData = [
    { day: "Monday", performance: 75 },
    { day: "Tuesday", performance: 85 },
    { day: "Wednesday", performance: 65 },
    { day: "Thursday", performance: 92 },
    { day: "Friday", performance: 80 },
    { day: "Saturday", performance: 70 },
    { day: "Sunday", performance: 60 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>This Week's Performance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {weeklyData.map((data) => (
          <div key={data.day} className="flex items-center justify-between">
            <span className="text-sm text-slate-600 w-20">{data.day}</span>
            <div className="flex-1 mx-4">
              <div className="bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-primary to-secondary rounded-full h-2 transition-all duration-300" 
                  style={{ width: `${data.performance}%` }}
                />
              </div>
            </div>
            <span className="text-sm font-medium text-slate-900 w-8">{data.performance}%</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
