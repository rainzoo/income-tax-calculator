import {
	Box,
	Card,
	CardContent,
	Container,
	CssBaseline,
	createTheme,
	Skeleton,
	ThemeProvider,
	Typography,
} from "@mui/material";
import { useState } from "react";
import ComparisonTable from "./components/ComparisonTable";
import Header from "./components/Header";
import MonthWiseBreakdown from "./components/MonthWiseBreakdown";
import RegimeSelector from "./components/RegimeSelector";
import SalaryInputForm from "./components/SalaryInputForm";
import TaxChart from "./components/TaxChart";
import {
	calculateAnnualSummary,
	calculateMonthlyBreakdown,
} from "./utils/taxCalculator";

const theme = createTheme({
	palette: {
		primary: {
			main: "#1565c0",
			light: "#42a5f5",
			dark: "#0d47a1",
		},
		secondary: {
			main: "#424242",
			light: "#6d6d6d",
			dark: "#1b1b1b",
		},
		success: {
			main: "#2e7d32",
			light: "#4caf50",
			dark: "#1b5e20",
		},
		error: {
			main: "#d32f2f",
			light: "#ef5350",
			dark: "#c62828",
		},
		warning: {
			main: "#f57c00",
			light: "#ffb74d",
			dark: "#e65100",
		},
		info: {
			main: "#0288d1",
			light: "#4fc3f7",
			dark: "#01579b",
		},
		background: {
			default: "#f8fafc",
			paper: "#ffffff",
		},
		text: {
			primary: "#1a202c",
			secondary: "#4a5568",
		},
	},
	typography: {
		fontFamily: [
			"-apple-system",
			"BlinkMacSystemFont",
			'"Segoe UI"',
			"Roboto",
			'"Helvetica Neue"',
			"Arial",
			"sans-serif",
		].join(","),
		h1: {
			fontSize: "2.5rem",
			fontWeight: 700,
			lineHeight: 1.2,
		},
		h2: {
			fontSize: "2rem",
			fontWeight: 600,
			lineHeight: 1.3,
		},
		h3: {
			fontSize: "1.75rem",
			fontWeight: 600,
			lineHeight: 1.3,
		},
		h4: {
			fontSize: "1.5rem",
			fontWeight: 600,
			lineHeight: 1.4,
		},
		h5: {
			fontSize: "1.25rem",
			fontWeight: 600,
			lineHeight: 1.4,
		},
		h6: {
			fontSize: "1.125rem",
			fontWeight: 600,
			lineHeight: 1.4,
		},
		body1: {
			fontSize: "1rem",
			lineHeight: 1.6,
		},
		body2: {
			fontSize: "0.875rem",
			lineHeight: 1.5,
		},
	},
	shape: {
		borderRadius: 12,
	},
	components: {
		MuiCard: {
			styleOverrides: {
				root: {
					boxShadow:
						"0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
					borderRadius: 12,
					border: "1px solid rgba(0, 0, 0, 0.08)",
				},
			},
		},
		MuiPaper: {
			styleOverrides: {
				root: {
					borderRadius: 12,
				},
				elevation1: {
					boxShadow:
						"0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
				},
				elevation2: {
					boxShadow:
						"0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
				},
				elevation3: {
					boxShadow:
						"0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
				},
			},
		},
		MuiButton: {
			styleOverrides: {
				root: {
					borderRadius: 8,
					textTransform: "none",
					fontWeight: 600,
					boxShadow: "none",
					"&:hover": {
						boxShadow: "0 4px 8px rgba(0, 0, 0, 0.12)",
					},
				},
				contained: {
					boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
				},
			},
		},
	},
});

function App() {
	const [summary, setSummary] = useState(null);
	const [monthlyData, setMonthlyData] = useState(null);
	const [selectedRegime, setSelectedRegime] = useState("old");
	const [isCalculating, setIsCalculating] = useState(false);

	const handleCalculate = async (data) => {
		setIsCalculating(true);

		// Simulate calculation delay for better UX
		await new Promise((resolve) => setTimeout(resolve, 800));

		const annualSummary = calculateAnnualSummary(data);
		const monthlyBreakdown = calculateMonthlyBreakdown(data);

		setSummary(annualSummary);
		setMonthlyData(monthlyBreakdown);
		setIsCalculating(false);

		// Scroll to results
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
				<Header />
				<Container maxWidth="lg" sx={{ py: 4 }}>
					<Box
						sx={{
							display: "flex",
							flexDirection: { xs: "column", md: "row" },
							gap: 4,
						}}
					>
						{/* Left Column: Input Form */}
						<Box sx={{ flex: "1 1 40%" }}>
							<SalaryInputForm onCalculate={handleCalculate} />
						</Box>

						{/* Right Column: Tax Calculation Results */}
						<Box sx={{ flex: "1 1 60%" }}>
							{isCalculating ? (
								<Box>
									{/* Loading Skeleton for Chart */}
									<Card sx={{ mb: 4 }}>
										<CardContent sx={{ p: 4 }}>
											<Box
												sx={{ display: "flex", alignItems: "center", mb: 4 }}
											>
												<Skeleton
													variant="circular"
													width={28}
													height={28}
													sx={{ mr: 2 }}
												/>
												<Skeleton variant="text" width={200} height={32} />
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
												<Skeleton variant="circular" width={120} height={120} />
												<Box sx={{ minWidth: 280 }}>
													<Box
														sx={{
															display: "flex",
															flexDirection: "column",
															gap: 3,
														}}
													>
														<Skeleton
															variant="rectangular"
															width="100%"
															height={80}
														/>
														<Skeleton
															variant="rectangular"
															width="100%"
															height={80}
														/>
													</Box>
													<Skeleton
														variant="rectangular"
														width="100%"
														height={100}
														sx={{ mt: 3 }}
													/>
												</Box>
											</Box>
										</CardContent>
									</Card>

									{/* Loading Skeleton for Comparison Table */}
									<Card sx={{ mb: 4 }}>
										<CardContent sx={{ p: 4 }}>
											<Box
												sx={{ display: "flex", alignItems: "center", mb: 4 }}
											>
												<Skeleton
													variant="circular"
													width={28}
													height={28}
													sx={{ mr: 2 }}
												/>
												<Skeleton variant="text" width={180} height={32} />
											</Box>
											<Skeleton
												variant="rectangular"
												width="100%"
												height={300}
											/>
											<Skeleton
												variant="rectangular"
												width="100%"
												height={120}
												sx={{ mt: 3 }}
											/>
										</CardContent>
									</Card>

									{/* Loading Skeleton for Monthly Breakdown */}
									<Card>
										<CardContent sx={{ p: 4 }}>
											<Box
												sx={{ display: "flex", alignItems: "center", mb: 4 }}
											>
												<Skeleton
													variant="circular"
													width={28}
													height={28}
													sx={{ mr: 2 }}
												/>
												<Skeleton variant="text" width={200} height={32} />
												<Skeleton
													variant="rectangular"
													width={80}
													height={32}
													sx={{ ml: "auto" }}
												/>
											</Box>
											<Skeleton
												variant="rectangular"
												width="100%"
												height={400}
											/>
											<Skeleton
												variant="rectangular"
												width="100%"
												height={150}
												sx={{ mt: 3 }}
											/>
										</CardContent>
									</Card>
								</Box>
							) : summary ? (
								<Box>
									{/* Income Distribution Chart */}
									<Box sx={{ mb: 4 }}>
										<TaxChart summary={summary} />
									</Box>

									{/* Analysis & Comparison Section */}
									<Box sx={{ mb: 4 }}>
										<Typography
											variant="h6"
											fontWeight="semibold"
											sx={{ mb: 2, color: "text.secondary" }}
										>
											Regime Analysis & Comparison
										</Typography>
										<ComparisonTable summary={summary} />
									</Box>

									{/* Monthly Breakdown Section */}
									<Box>
										<Typography
											variant="h6"
											fontWeight="semibold"
											sx={{ mb: 2, color: "text.secondary" }}
										>
											Monthly Salary Breakdown
										</Typography>
										<RegimeSelector
											regime={selectedRegime}
											onChange={setSelectedRegime}
										/>
										<MonthWiseBreakdown
											monthlyData={monthlyData}
											selectedRegime={selectedRegime}
										/>
									</Box>
								</Box>
							) : (
								<Card
									sx={{
										height: "100%",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										minHeight: 400,
									}}
								>
									<CardContent sx={{ textAlign: "center", p: 6 }}>
										<Box sx={{ opacity: 0.7 }}>
											<Typography
												variant="h6"
												color="text.secondary"
												gutterBottom
												sx={{ fontWeight: 600 }}
											>
												Tax Calculation Results
											</Typography>
											<Typography variant="body1" color="text.secondary">
												Enter your salary details to see comprehensive tax
												calculations here
											</Typography>
										</Box>
									</CardContent>
								</Card>
							)}
						</Box>
					</Box>

					{/* Footer */}
					<Box component="footer" mt={8} textAlign="center">
						<Box
							sx={{
								p: 4,
								bgcolor: "background.paper",
								borderRadius: 3,
								boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
								border: "1px solid rgba(0, 0, 0, 0.06)",
								position: "relative",
								"&::before": {
									content: '""',
									position: "absolute",
									top: 0,
									left: 0,
									right: 0,
									height: "4px",
									background:
										"linear-gradient(90deg, #1565c0, #42a5f5, #0d47a1)",
									borderRadius: "12px 12px 0 0",
								},
							}}
						>
							<Typography
								variant="h6"
								sx={{
									color: "primary.main",
									fontWeight: 600,
									mb: 3,
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									gap: 1,
								}}
							>
								⚠️ Important Disclaimer
							</Typography>
							<Typography
								variant="body1"
								color="text.secondary"
								gutterBottom
								sx={{ mb: 2, fontWeight: 500 }}
							>
								This calculator provides estimates based on FY 2025-26 Indian
								tax rules and regulations.
							</Typography>
							<Typography
								variant="body2"
								color="text.secondary"
								gutterBottom
								sx={{ mb: 3 }}
							>
								For accurate tax planning and filing, please consult with a
								qualified Chartered Accountant or tax advisor. This tool is for
								educational and planning purposes only.
							</Typography>
							<Box
								sx={{
									display: "flex",
									flexWrap: "wrap",
									justifyContent: "center",
									gap: 3,
									mt: 3,
									pt: 3,
									borderTop: "1px solid rgba(0, 0, 0, 0.08)",
								}}
							>
								<Box sx={{ textAlign: "center" }}>
									<Typography
										variant="body2"
										color="text.secondary"
										sx={{ fontWeight: 600 }}
									>
										Tax Components Included
									</Typography>
									<Typography variant="caption" color="text.secondary">
										Income Tax • Surcharge • Cess (4%)
									</Typography>
								</Box>
								<Box sx={{ textAlign: "center" }}>
									<Typography
										variant="body2"
										color="text.secondary"
										sx={{ fontWeight: 600 }}
									>
										Special Provisions
									</Typography>
									<Typography variant="caption" color="text.secondary">
										HRA • RSU • Section 80C/80D
									</Typography>
								</Box>
								<Box sx={{ textAlign: "center" }}>
									<Typography
										variant="body2"
										color="text.secondary"
										sx={{ fontWeight: 600 }}
									>
										Tax Regimes
									</Typography>
									<Typography variant="caption" color="text.secondary">
										Old Regime • New Regime
									</Typography>
								</Box>
							</Box>
						</Box>
					</Box>
				</Container>
			</Box>
		</ThemeProvider>
	);
}

export default App;
