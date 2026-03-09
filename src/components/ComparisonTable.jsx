import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import TableChartIcon from "@mui/icons-material/TableChart";
import { Box, Card, CardContent, Typography } from "@mui/material";

export default function ComparisonTable({ summary }) {
	if (!summary) return null;

	const formatCurrency = (amount) => {
		return new Intl.NumberFormat("en-IN", {
			style: "currency",
			currency: "INR",
			maximumFractionDigits: 0,
		}).format(amount);
	};

	const isNewRegimeBetter = summary.recommendedRegime === "new";
	const savings = Math.abs(summary.savings);

	const comparisonData = [
		{
			label: "Gross Salary",
			oldRegime: summary.grossSalary,
			newRegime: summary.grossSalary,
			difference: 0,
			highlight: false,
		},
		{
			label: "Total Deductions",
			oldRegime: summary.oldRegime.deductions,
			newRegime: summary.newRegime.deductions,
			difference: summary.newRegime.deductions - summary.oldRegime.deductions,
			highlight: true,
		},
		{
			label: "Taxable Income",
			oldRegime: summary.oldRegime.taxableIncome,
			newRegime: summary.newRegime.taxableIncome,
			difference:
				summary.newRegime.taxableIncome - summary.oldRegime.taxableIncome,
			highlight: true,
		},
		{
			label: "Income Tax",
			oldRegime: summary.oldRegime.tax,
			newRegime: summary.newRegime.tax + summary.newRegime.rebate,
			difference:
				summary.newRegime.tax +
				summary.newRegime.rebate -
				summary.oldRegime.tax,
			highlight: true,
		},
		{
			label: "Surcharge",
			oldRegime: summary.oldRegime.surcharge,
			newRegime: summary.newRegime.surcharge,
			difference: summary.newRegime.surcharge - summary.oldRegime.surcharge,
			highlight: false,
		},
		{
			label: "Cess (4%)",
			oldRegime: summary.oldRegime.cess,
			newRegime: summary.newRegime.cess,
			difference: summary.newRegime.cess - summary.oldRegime.cess,
			highlight: false,
		},
		{
			label: "Total Tax",
			oldRegime: summary.oldRegime.totalTax,
			newRegime: summary.newRegime.totalTax,
			difference: summary.savings,
			highlight: true,
			isTotal: true,
		},
		{
			label: "Net Salary (After Tax)",
			oldRegime: summary.oldRegime.netSalary,
			newRegime: summary.newRegime.netSalary,
			difference: -summary.savings,
			highlight: true,
			isTotal: true,
		},
	];

	return (
		<Card sx={{ mb: 4 }}>
			<CardContent sx={{ p: 4 }}>
				<Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
					<CompareArrowsIcon
						sx={{ mr: 2, color: "primary.main", fontSize: 28 }}
					/>
					<Typography
						variant="h5"
						sx={{ fontWeight: 700, color: "text.primary" }}
					>
						Regime Comparison
					</Typography>
				</Box>

				<Box sx={{ overflowX: "auto", mb: 4 }}>
					<Box
						component="table"
						sx={{
							minWidth: "100%",
							borderCollapse: "separate",
							borderSpacing: "0 4px",
						}}
					>
						<Box component="thead">
							<Box component="tr">
								<Box
									component="th"
									sx={{
										px: 3,
										py: 2,
										textAlign: "left",
										fontSize: "0.75rem",
										fontWeight: 600,
										color: "text.secondary",
										textTransform: "uppercase",
										letterSpacing: "0.05em",
										borderBottom: "1px solid rgba(255,255,255,0.1)",
									}}
								>
									Component
								</Box>
								<Box
									component="th"
									sx={{
										px: 3,
										py: 2,
										textAlign: "right",
										fontSize: "0.75rem",
										fontWeight: 600,
										color: "error.light",
										textTransform: "uppercase",
										letterSpacing: "0.05em",
										bgcolor: "rgba(239, 68, 68, 0.1)",
										borderBottom: "1px solid rgba(239, 68, 68, 0.2)",
									}}
								>
									Old Regime
								</Box>
								<Box
									component="th"
									sx={{
										px: 3,
										py: 2,
										textAlign: "right",
										fontSize: "0.75rem",
										fontWeight: 600,
										color: "primary.light",
										textTransform: "uppercase",
										letterSpacing: "0.05em",
										bgcolor: "rgba(59, 130, 246, 0.1)",
										borderBottom: "1px solid rgba(59, 130, 246, 0.2)",
									}}
								>
									New Regime
								</Box>
								<Box
									component="th"
									sx={{
										px: 3,
										py: 2,
										textAlign: "right",
										fontSize: "0.75rem",
										fontWeight: 600,
										color: "success.light",
										textTransform: "uppercase",
										letterSpacing: "0.05em",
										bgcolor: "rgba(34, 197, 94, 0.1)",
										borderBottom: "1px solid rgba(34, 197, 94, 0.2)",
									}}
								>
									Difference
								</Box>
							</Box>
						</Box>
						<Box component="tbody">
							{comparisonData.map((row) => {
								const isPositive = row.difference > 0;
								const isZero = row.difference === 0;

								return (
									<Box
										component="tr"
										key={row.label}
										sx={{
											bgcolor: row.isTotal
												? "rgba(255, 255, 255, 0.05)"
												: "background.paper",
											borderLeft: row.highlight ? 4 : 0,
											borderColor: "primary.main",
											"&:hover": { bgcolor: "rgba(255, 255, 255, 0.02)" },
										}}
									>
										<Box
											component="td"
											sx={{
												px: 3,
												py: 2,
												fontSize: "0.875rem",
												fontWeight: row.isTotal ? 700 : 500,
												color: "text.primary",
												whiteSpace: "nowrap",
												borderBottom: "1px solid rgba(255,255,255,0.05)",
											}}
										>
											{row.label}
										</Box>
										<Box
											component="td"
											sx={{
												px: 3,
												py: 2,
												fontSize: "0.875rem",
												color: "text.primary",
												textAlign: "right",
												bgcolor: "rgba(239, 68, 68, 0.05)",
												whiteSpace: "nowrap",
												fontVariantNumeric: "tabular-nums",
												borderBottom: "1px solid rgba(255,255,255,0.05)",
											}}
										>
											{formatCurrency(row.oldRegime)}
										</Box>
										<Box
											component="td"
											sx={{
												px: 3,
												py: 2,
												fontSize: "0.875rem",
												color: "text.primary",
												textAlign: "right",
												bgcolor: "rgba(59, 130, 246, 0.05)",
												whiteSpace: "nowrap",
												fontVariantNumeric: "tabular-nums",
												borderBottom: "1px solid rgba(255,255,255,0.05)",
											}}
										>
											{formatCurrency(row.newRegime)}
										</Box>
										<Box
											component="td"
											sx={{
												px: 3,
												py: 2,
												fontSize: "0.875rem",
												textAlign: "right",
												bgcolor: "rgba(34, 197, 94, 0.05)",
												whiteSpace: "nowrap",
												fontWeight: 600,
												fontVariantNumeric: "tabular-nums",
												borderBottom: "1px solid rgba(255,255,255,0.05)",
												color: isZero
													? "text.secondary"
													: isPositive
														? "success.main"
														: "error.main",
											}}
										>
											{isZero
												? "—"
												: `${isPositive ? "+" : ""}${formatCurrency(row.difference)}`}
											{!isZero && row.isTotal && (
												<Typography
													component="span"
													sx={{
														ml: 1,
														fontSize: "0.75rem",
														color: "text.secondary",
													}}
												>
													({isNewRegimeBetter ? "Save" : "Pay More"})
												</Typography>
											)}
										</Box>
									</Box>
								);
							})}
						</Box>
					</Box>
				</Box>

				<Card
					sx={{
						bgcolor: "rgba(59, 130, 246, 0.05)",
						border: "1px solid",
						borderColor: "rgba(59, 130, 246, 0.2)",
						borderRadius: 2,
					}}
				>
					<CardContent sx={{ p: 3 }}>
						<Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
							<TableChartIcon sx={{ mr: 1, color: "primary.main" }} />
							<Typography
								variant="h6"
								sx={{ fontWeight: 600, color: "primary.light" }}
							>
								Key Insights
							</Typography>
						</Box>
						<Box component="ul" sx={{ pl: 2, m: 0 }}>
							<Typography
								component="li"
								variant="body2"
								color="text.secondary"
								sx={{ mb: 1 }}
							>
								<strong>Old Regime</strong> allows multiple deductions (80C,
								80D, HRA, etc.) but has lower exemption limit.
							</Typography>
							<Typography
								component="li"
								variant="body2"
								color="text.secondary"
								sx={{ mb: 1 }}
							>
								<strong>New Regime</strong> offers ₹75,000 standard deduction
								and higher exemption limit (₹4L).
							</Typography>
							<Typography
								component="li"
								variant="body2"
								color="text.secondary"
								sx={{ mb: 1 }}
							>
								{isNewRegimeBetter
									? `You save ${formatCurrency(savings)} annually with the New Regime.`
									: `You save ${formatCurrency(savings)} annually with the Old Regime.`}
							</Typography>
							{summary.newRegime.rebate > 0 && (
								<Typography
									component="li"
									variant="body2"
									color="text.secondary"
								>
									<strong>Section 87A Rebate:</strong> Applied in New Regime as
									taxable income is below ₹12L.
								</Typography>
							)}
						</Box>
					</CardContent>
				</Card>
			</CardContent>
		</Card>
	);
}
