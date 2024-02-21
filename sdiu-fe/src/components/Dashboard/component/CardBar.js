// import {
//   Card,
//   CardContent,
//   Typography,
//   Divider,
//   Paper
// } from "@mui/material";
// import React from "react";


// function CardBar({ title, chart }) {
//   return (
//     <>
//       <Card>
//         <CardContent>
//           <Typography sx={{
//               textTransform: "uppercase"
//           }} color="textPrimary">
//             {title}
//           </Typography>
//           <Divider />
//           {chart}
//         </CardContent>
//       </Card>
//     </>
//   );
// }

// export default CardBar;
import React from "react";
import { Card, CardContent, Typography, Divider, Paper } from "@mui/material";
import { Doughnut } from "react-chartjs-2";

function CardBar({ title, chartData }) {
  const chartOptions = {
    maintainAspectRatio: false, // Tùy chọn để giữ tỷ lệ khung hình
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "right",
      },
    },
  };

  return (
    <Card>
      <CardContent>
        <Typography sx={{ textTransform: "uppercase" }} color="textPrimary">
          {title}
        </Typography>
        <Divider />
        <Doughnut data={chartData} options={chartOptions} />
      </CardContent>
    </Card>
  );
}

export default CardBar;
