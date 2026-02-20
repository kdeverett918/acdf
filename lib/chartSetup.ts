import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
  ScatterController,
} from 'chart.js';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, PointElement,
  LineElement, RadialLinearScale, ArcElement, Tooltip, Legend, Filler,
  ScatterController
);

ChartJS.defaults.color = '#8896b3';
ChartJS.defaults.borderColor = 'rgba(38,51,84,.5)';
ChartJS.defaults.font.family = "'Inter',system-ui,sans-serif";
ChartJS.defaults.font.size = 12;
ChartJS.defaults.plugins.legend.labels.usePointStyle = true;
ChartJS.defaults.plugins.legend.labels.pointStyleWidth = 10;
ChartJS.defaults.plugins.tooltip.backgroundColor = '#1a2236';
ChartJS.defaults.plugins.tooltip.borderColor = '#263354';
ChartJS.defaults.plugins.tooltip.borderWidth = 1;
ChartJS.defaults.plugins.tooltip.cornerRadius = 8;
ChartJS.defaults.plugins.tooltip.padding = 10;
