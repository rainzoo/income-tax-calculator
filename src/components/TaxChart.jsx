import PieChartIcon from "@mui/icons-material/PieChart";
import { Box, Card, CardContent, Typography } from "@mui/material";

export default function TaxChart({ summary }) {
	if (!summary) return null;

	// Calculate percentages for the recommended regime
	const recommendedRegime =
		summary.recommendedRegime === "new" ? summary.newRegime : summary.oldRegime;
	const grossSalary = summary.grossSalary;
	const totalTax = recommendedRegime.totalTax;
	const netSalary = recommendedRegime.netSalary;

	const taxPercentage = Math.round((totalTax / grossSalary) * 100);
	const netPercentage = Math.round((netSalary / grossSalary) * 100);

	// Simple pie chart using SVG
	const size = 120;
	const strokeWidth = 20;
	const radius = (size - strokeWidth) / 2;
	const circumference = radius * 2 * Math.PI;
	const taxArc = (taxPercentage / 100) * circumference;

	const formatCurrency = (amount) => {
		return new Intl.NumberFormat("en-IN", {
			style: "currency",
			currency: "INR",
			maximumFractionDigits: 0,
		}).format(amount);
	};

	return (
		<Card
			sx={{
				mb: 4,
				bgcolor: "background.paper",
				border: "1px solid",
				borderColor: "primary.dark",
				boxShadow: "0 0 30px rgba(59, 130, 246, 0.05)",
			}}
			role="region"
			aria-label="Income Distribution Chart"
		>
			<CardContent sx={{ p: 4 }}>
				<Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
					<PieChartIcon sx={{ mr: 2, color: "primary.main", fontSize: 28 }} />
					<Typography
						variant="h5"
						sx={{ fontWeight: 700, color: "text.primary" }}
					>
						Income Distribution
					</Typography>
				</Box>

				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						gap: 6,
						flexWrap: "wrap",
					}}
				>
					{/* Enhanced Pie Chart */}
					<Box sx={{ position: "relative" }}>
						<svg
							width={size}
							height={size}
							style={{ filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))" }}
						>
							<title>Income Distribution Pie Chart</title>
							{/* Background circle with gradient */}
							<defs>
								<linearGradient
									id="backgroundGradient"
									x1="0%"
									y1="0%"
									x2="100%"
									y2="100%"
								>
									<stop
										offset="0%"
										style={{ stopColor: "#27272a", stopOpacity: 1 }}
									/>
									<stop
										offset="100%"
										style={{ stopColor: "#18181b", stopOpacity: 1 }}
									/>
								</linearGradient>
								<linearGradient
									id="taxGradient"
									x1="0%"
									y1="0%"
									x2="100%"
									y2="100%"
								>
									<stop
										offset="0%"
										style={{ stopColor: "#ef4444", stopOpacity: 1 }}
									/>
									<stop
										offset="100%"
										style={{ stopColor: "#b91c1c", stopOpacity: 1 }}
									/>
								</linearGradient>
								<linearGradient
									id="netGradient"
									x1="0%"
									y1="0%"
									x2="100%"
									y2="100%"
								>
									<stop
										offset="0%"
										style={{ stopColor: "#22c55e", stopOpacity: 1 }}
									/>
									<stop
										offset="100%"
										style={{ stopColor: "#15803d", stopOpacity: 1 }}
									/>
								</linearGradient>
							</defs>

							{/* Background circle */}
							<circle
								cx={size / 2}
								cy={size / 2}
								r={radius}
								fill="none"
								stroke="url(#backgroundGradient)"
								strokeWidth={strokeWidth}
							/>

							{/* Net salary portion (background) */}
							<circle
								cx={size / 2}
								cy={size / 2}
								r={radius}
								fill="none"
								stroke="url(#netGradient)"
								strokeWidth={strokeWidth}
								strokeDasharray={`${circumference} 0`}
								strokeDashoffset={0}
								transform={`rotate(-90 ${size / 2} ${size / 2})`}
							/>

							{/* Tax portion (overlay) */}
							<circle
								cx={size / 2}
								cy={size / 2}
								r={radius}
								fill="none"
								stroke="url(#taxGradient)"
								strokeWidth={strokeWidth}
								strokeDasharray={`${taxArc} ${circumference - taxArc}`}
								strokeDashoffset={0}
								transform={`rotate(-90 ${size / 2} ${size / 2})`}
								style={{ transition: "stroke-dasharray 0.8s ease-in-out" }}
							/>
						</svg>

						{/* Center text with enhanced styling */}
						<Box
							sx={{
								position: "absolute",
								top: "50%",
								left: "50%",
								transform: "translate(-50%, -50%)",
								textAlign: "center",
								backgroundColor: "rgba(24, 24, 27, 0.9)",
								border: "1px solid rgba(255, 255, 255, 0.1)",
								borderRadius: "50%",
								width: 60,
								height: 60,
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								justifyContent: "center",
								boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
							}}
						>
							<Typography
								variant="h6"
								sx={{ fontWeight: 800, color: "error.main", lineHeight: 1 }}
							>
								{taxPercentage}%
							</Typography>
							<Typography
								variant="caption"
								sx={{
									color: "text.secondary",
									fontWeight: 600,
									fontSize: "0.7rem",
								}}
							>
								Tax
							</Typography>
						</Box>
					</Box>

					{/* Enhanced Legend */}
					<Box sx={{ minWidth: 280 }}>
						<Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
							{/* Net Salary */}
							<Box
								sx={{
									boxShadow: "0 2px 8px rgba(34, 197, 94, 0.2)",
								}}
							>
								<Box
									sx={{
										width: 20,
										height: 20,
										background: "linear-gradient(135deg, #22c55e, #15803d)",
										borderRadius: 1,
										boxShadow: "0 2px 4px rgba(34, 197, 94, 0.3)",
									}}
								/>
								<Box sx={{ flex: 1 }}>
									<Typography
										variant="body2"
										sx={{ fontWeight: 600, color: "success.main" }}
									>
										Net Salary: {netPercentage}%
									</Typography>
									<Typography
										variant="h6"
										sx={{ fontWeight: 700, color: "success.dark" }}
									>
										{formatCurrency(netSalary)}
									</Typography>
								</Box>
							</Box>

							{/* Tax */}
							<Box
								sx={{
									boxShadow: "0 2px 8px rgba(239, 68, 68, 0.2)",
								}}
							>
								<Box
									sx={{
										width: 20,
										height: 20,
										background: "linear-gradient(135deg, #ef4444, #b91c1c)",
										borderRadius: 1,
										boxShadow: "0 2px 4px rgba(239, 68, 68, 0.3)",
									}}
								/>
								<Box sx={{ flex: 1 }}>
									<Typography
										variant="body2"
										sx={{ fontWeight: 600, color: "error.main" }}
									>
										Tax: {taxPercentage}%
									</Typography>
									<Typography
										variant="h6"
										sx={{ fontWeight: 700, color: "error.dark" }}
									>
										{formatCurrency(totalTax)}
									</Typography>
								</Box>
							</Box>
						</Box>

						{/* Summary Card */}
						<Card
							sx={{
								mt: 3,
								backgroundColor: "background.paper",
								border: "1px solid",
								borderColor: "rgba(255, 255, 255, 0.1)",
								boxShadow: "inset 0 0 20px rgba(0,0,0,0.5)",
							}}
						>
							<CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
								<Typography
									variant="body2"
									sx={{ fontWeight: 600, color: "text.primary", mb: 1 }}
								>
									💰 Total Income: {formatCurrency(grossSalary)}
								</Typography>
								<Typography
									variant="body2"
									sx={{ fontWeight: 600, color: "text.primary" }}
								>
									🎯 Regime:{" "}
									{summary.recommendedRegime === "new" ? "New" : "Old"}{" "}
									(Recommended)
								</Typography>
							</CardContent>
						</Card>
					</Box>
				</Box>
			</CardContent>
		</Card>
	);
}
