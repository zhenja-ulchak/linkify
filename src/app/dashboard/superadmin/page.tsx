"use client";
import React, { useState } from "react";
import { Grid, Card, CardContent, Typography, Box, Slider } from "@mui/material";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

// Регістрація необхідних компонентів для графіка
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Superadmin() {
    const [sliderValue, setSliderValue] = useState<number>(50);

    const data = [
        { title: "Sales", value: "$34,000", change: "+5%" },
        { title: "Users", value: "2,340", change: "-2%" },
        { title: "Orders", value: "1,123", change: "+10%" },
    ];

    const handleSliderChange = (event: Event, newValue: number | number[]) => {
        setSliderValue(newValue as number);
    };

    // Дані для графіка
    const chartData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'Sales Over Time',
                data: [12, 19, 3, 5, 2, 3, 9],
                fill: false,
                borderColor: 'rgba(75,192,192,1)',
                tension: 0.1,
            },
        ],
    };

    return (
        <Box sx={{ flexGrow: 1, padding: 2, marginLeft: '65px' }}>

            <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>

                <h1>Superadmin</h1>

            </div>
            <Grid container spacing={3}>
                {data.map((item, index) => (
                    <Grid item xs={12} sm={4} key={index}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" component="div">
                                    {item.title}
                                </Typography>
                                <Typography variant="h4" color="text.secondary">
                                    {item.value}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {item.change}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3} marginTop={3}>
                <Grid item xs={12} sm={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" component="div">
                                Adjust Value with Slider
                            </Typography>
                            <Slider
                                value={sliderValue}
                                onChange={handleSliderChange}
                                aria-labelledby="slider"
                                min={0}
                                max={100}
                                step={1}
                            />
                            <Typography variant="body2" color="text.secondary">
                                Value: {sliderValue}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" component="div">
                                Sales Graph
                            </Typography>
                            <Line data={chartData} />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}