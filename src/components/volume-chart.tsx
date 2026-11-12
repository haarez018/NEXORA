"use client";
import { useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { demoTrend } from "@/modules/core/demo-data";
export function VolumeChart() {
  const [range, setRange] = useState<"7D" | "4D">("7D");
  return <><div className="chart-controls"><div className="chart-legend"><span><i className="legend-dot cyan"/>Demand</span><span><i className="legend-dot violet"/>Proposed allocation</span></div><div className="segmented">{(["7D", "4D"] as const).map(item => <button key={item} aria-pressed={range === item} className={range === item ? "selected" : ""} onClick={() => setRange(item)}>{item}</button>)}</div></div>
    <div className="volume-chart" role="img" aria-label="Illustrative demand rises from 14,200 to 23,080 US dollars across seven days. These are synthetic observations.">
    <ResponsiveContainer width="100%" height="100%" minWidth={0}><AreaChart data={range === "7D" ? demoTrend : demoTrend.slice(-4)} margin={{ top: 15, right: 6, left: -20, bottom: 0 }}>
      <defs><linearGradient id="cyanFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#28d9ed" stopOpacity={0.2}/><stop offset="100%" stopColor="#28d9ed" stopOpacity={0}/></linearGradient><linearGradient id="violetFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8e8aff" stopOpacity={0.12}/><stop offset="100%" stopColor="#8e8aff" stopOpacity={0}/></linearGradient></defs>
      <CartesianGrid stroke="#202c40" vertical={false} strokeDasharray="3 5"/><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#8190a9", fontSize: 11 }} dy={10}/><YAxis axisLine={false} tickLine={false} tick={{ fill: "#8190a9", fontSize: 10 }} tickFormatter={v => "$" + Number(v) / 1000 + "k"}/>
      <Tooltip contentStyle={{ background: "#101c2f", border: "1px solid #2a3b52", borderRadius: 10, color: "#e5edf8" }} formatter={value => "$" + Number(value).toLocaleString("en-US")}/>
      <Area type="monotone" dataKey="allocated" name="Proposed allocation" stroke="#8e8aff" strokeWidth={2} fill="url(#violetFill)"/><Area type="monotone" dataKey="demand" name="Demand" stroke="#28d9ed" strokeWidth={2.5} fill="url(#cyanFill)"/>
    </AreaChart></ResponsiveContainer></div><p className="chart-footnote">Illustrative whole-USD observations · not payment activity</p></>;
}
