import { CalendarMonth } from "@mui/icons-material";
import {
	Box,
	Card,
	CardContent,
	Chip,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from "@mui/material";

export default function MonthWiseBreakdown({ monthlyData, selectedRegime }) {
	if (!monthlyData || monthlyData.length === 0) return null;

	const formatCurrency = (amount) => {
		return new Intl.NumberFormat("en-IN", {
			style: "currency",
			currency: "INR",
			maximumFractionDigits: 0,
		}).format(amount);
	};

	const isOldRegime = selectedRegime === "old";
	const lastMonth = monthlyData[monthlyData.length - 1];

	return (
		<Card sx={{ mb: 4 }}>
			<CardContent sx={{ p: 4 }}>
				<Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
					<CalendarMonth sx={{ mr: 2, color: "primary.main", fontSize: 28 }} />
					<Box>
						<Typography
							variant="h5"
							component="h2"
							sx={{ fontWeight: 700, color: "text.primary" }}
						>
							Month-wise Breakdown
						</Typography>
						<Chip
							label={isOldRegime ? "Old Regime" : "New Regime"}
							color={isOldRegime ? "error" : "primary"}
							size="small"
							sx={{ mt: 1, fontWeight: 600 }}
						/>
					</Box>
				</Box>

				<TableContainer sx={{ maxHeight: 600 }}>
					<Table stickyHeader>
						<TableHead>
							<TableRow>
								<TableCell
									sx={{
										position: "sticky",
										left: 0,
										zIndex: 3,
										bgcolor: "background.paper",
										fontWeight: "bold",
										color: "text.primary",
										borderBottom: "1px solid rgba(255,255,255,0.1)",
									}}
								>
									Month
								</TableCell>
								<TableCell
									align="right"
									sx={{
										fontWeight: "bold",
										color: "text.primary",
										borderBottom: "1px solid rgba(255,255,255,0.1)",
									}}
								>
									Basic
								</TableCell>
								<TableCell
									align="right"
									sx={{
										fontWeight: "bold",
										color: "text.primary",
										borderBottom: "1px solid rgba(255,255,255,0.1)",
									}}
								>
									HRA
								</TableCell>
								<TableCell
									align="right"
									sx={{
										fontWeight: "bold",
										color: "text.primary",
										borderBottom: "1px solid rgba(255,255,255,0.1)",
									}}
								>
									Allowances
								</TableCell>
								<TableCell
									align="right"
									sx={{
										fontWeight: "bold",
										bgcolor: "rgba(245, 158, 11, 0.1)",
										color: "warning.main",
										borderBottom: "1px solid rgba(245, 158, 11, 0.2)",
									}}
								>
									RSU (Net)
								</TableCell>
								<TableCell
									align="right"
									sx={{
										fontWeight: "bold",
										bgcolor: "rgba(255, 255, 255, 0.05)",
										color: "text.primary",
										borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
									}}
								>
									Gross Salary
								</TableCell>
								<TableCell
									align="right"
									sx={{
										fontWeight: "bold",
										bgcolor: "rgba(239, 68, 68, 0.1)",
										color: "error.light",
										borderBottom: "1px solid rgba(239, 68, 68, 0.2)",
									}}
								>
									Income Tax
								</TableCell>
								<TableCell
									align="right"
									sx={{
										fontWeight: "bold",
										bgcolor: "rgba(59, 130, 246, 0.1)",
										color: "primary.light",
										borderBottom: "1px solid rgba(59, 130, 246, 0.2)",
									}}
								>
									Provident Fund
								</TableCell>
								<TableCell
									align="right"
									sx={{
										fontWeight: "bold",
										bgcolor: "rgba(34, 197, 94, 0.1)",
										color: "success.light",
										borderBottom: "1px solid rgba(34, 197, 94, 0.2)",
									}}
								>
									Net Salary
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{monthlyData.map((month) => (
								<TableRow
									key={month.month}
									sx={{
										"&:hover": { bgcolor: "rgba(255,255,255,0.02)" },
									}}
								>
									<TableCell
										sx={{
											position: "sticky",
											left: 0,
											zIndex: 2,
											bgcolor: "background.paper",
											fontWeight: "medium",
											borderBottom: "1px solid rgba(255,255,255,0.05)",
										}}
									>
										{month.month}
									</TableCell>
									<TableCell
										align="right"
										sx={{
											fontVariantNumeric: "tabular-nums",
											borderBottom: "1px solid rgba(255,255,255,0.05)",
										}}
									>
										{formatCurrency(month.basic)}
									</TableCell>
									<TableCell
										align="right"
										sx={{
											fontVariantNumeric: "tabular-nums",
											borderBottom: "1px solid rgba(255,255,255,0.05)",
										}}
									>
										{formatCurrency(month.hra)}
									</TableCell>
									<TableCell
										align="right"
										sx={{
											fontVariantNumeric: "tabular-nums",
											borderBottom: "1px solid rgba(255,255,255,0.05)",
										}}
									>
										{formatCurrency(month.allowances)}
									</TableCell>
									<TableCell
										align="right"
										sx={{
											fontWeight: month.hasRSUPayout ? "bold" : "normal",
											bgcolor: month.hasRSUPayout
												? "rgba(245, 158, 11, 0.05)"
												: "transparent",
											color: month.hasRSUPayout ? "warning.main" : "inherit",
											fontVariantNumeric: "tabular-nums",
											borderBottom: "1px solid rgba(255,255,255,0.05)",
										}}
									>
										{month.hasRSUPayout ? formatCurrency(month.netRSU) : "—"}
									</TableCell>
									<TableCell
										align="right"
										sx={{
											fontWeight: "semibold",
											bgcolor: "rgba(255, 255, 255, 0.05)",
											fontVariantNumeric: "tabular-nums",
											borderBottom: "1px solid rgba(255,255,255,0.05)",
										}}
									>
										{formatCurrency(month.grossSalary)}
									</TableCell>
									<TableCell
										align="right"
										sx={{
											color: "error.main",
											fontWeight: "medium",
											fontVariantNumeric: "tabular-nums",
											borderBottom: "1px solid rgba(255,255,255,0.05)",
										}}
									>
										{formatCurrency(
											isOldRegime ? month.incomeTaxOld : month.incomeTaxNew,
										)}
									</TableCell>
									<TableCell
										align="right"
										sx={{
											color: "primary.main",
											fontWeight: "medium",
											fontVariantNumeric: "tabular-nums",
											borderBottom: "1px solid rgba(255,255,255,0.05)",
										}}
									>
										{formatCurrency(month.providentFund)}
									</TableCell>
									<TableCell
										align="right"
										sx={{
											color: "success.main",
											fontWeight: "bold",
											fontVariantNumeric: "tabular-nums",
											borderBottom: "1px solid rgba(255,255,255,0.05)",
										}}
									>
										{formatCurrency(
											isOldRegime ? month.netSalaryOld : month.netSalaryNew,
										)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>

				<Box
					mt={4}
					p={3}
					bgcolor="rgba(255, 255, 255, 0.05)"
					borderRadius={2}
					border="1px solid rgba(255,255,255,0.1)"
				>
					<Typography variant="h6" fontWeight="bold" gutterBottom>
						Annual Summary
					</Typography>
					<Box
						display="flex"
						justifyContent="space-between"
						flexWrap="wrap"
						gap={2}
						sx={{ fontVariantNumeric: "tabular-nums" }}
					>
						<Box>
							<Typography variant="body2" color="text.secondary">
								Total Gross Salary
							</Typography>
							<Typography variant="h6" fontWeight="bold">
								{formatCurrency(lastMonth.cumulativeGrossSalary)}
							</Typography>
						</Box>
						{lastMonth.cumulativeGrossRSU > 0 && (
							<>
								<Box>
									<Typography variant="body2" color="text.secondary">
										Total RSU (Gross)
									</Typography>
									<Typography
										variant="h6"
										fontWeight="bold"
										color="warning.main"
									>
										{formatCurrency(lastMonth.cumulativeGrossRSU)}
									</Typography>
								</Box>
								<Box>
									<Typography variant="body2" color="text.secondary">
										US Tax Withheld
									</Typography>
									<Typography variant="h6" fontWeight="bold" color="error.main">
										{formatCurrency(lastMonth.cumulativeUSTaxWithheld)}
									</Typography>
								</Box>
							</>
						)}
						<Box>
							<Typography variant="body2" color="text.secondary">
								Total Income Tax
							</Typography>
							<Typography variant="h6" fontWeight="bold" color="error.main">
								{formatCurrency(
									isOldRegime
										? lastMonth.cumulativeOldTax
										: lastMonth.cumulativeNewTax,
								)}
							</Typography>
						</Box>
						<Box>
							<Typography variant="body2" color="text.secondary">
								Total Provident Fund
							</Typography>
							<Typography variant="h6" fontWeight="bold" color="primary.main">
								{formatCurrency(lastMonth.cumulativeProvidentFund)}
							</Typography>
						</Box>
						<Box>
							<Typography variant="body2" color="text.secondary">
								Net Salary (Annual)
							</Typography>
							<Typography variant="h6" fontWeight="bold" color="success.main">
								{formatCurrency(
									isOldRegime
										? lastMonth.cumulativeGrossSalary -
												lastMonth.cumulativeOldTax -
												lastMonth.cumulativeProvidentFund
										: lastMonth.cumulativeGrossSalary -
												lastMonth.cumulativeNewTax -
												lastMonth.cumulativeProvidentFund,
								)}
							</Typography>
						</Box>
					</Box>
				</Box>

				<Box mt={3}>
					<Typography variant="caption" color="text.secondary">
						<strong>Note:</strong> Tax is calculated on an annual basis and
						distributed evenly across 12 months. Provident Fund is calculated as
						12% of basic salary (employee contribution).
					</Typography>
				</Box>
			</CardContent>
		</Card>
	);
}
