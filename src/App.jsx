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
import { lazy, Suspense, useState } from "react";

const SalaryInputForm = lazy(() => import("./components/SalaryInputForm"));
const TaxChart = lazy(() => import("./components/TaxChart"));
const ComparisonTable = lazy(() => import("./components/ComparisonTable"));
const MonthWiseBreakdown = lazy(
	() => import("./components/MonthWiseBreakdown"),
);
const RegimeSelector = lazy(() => import("./components/RegimeSelector"));

import Header from "./components/Header";
import {
	calculateAnnualSummary,
	calculateMonthlyBreakdown,
} from "./utils/taxCalculator";

const theme = createTheme({
	palette: {
		mode: "dark",
		primary: {
			main: "#3b82f6", // Blue
			light: "#60a5fa",
			dark: "#2563eb",
		},
		secondary: {
			main: "#a8a29e", // Stone
			light: "#d6d3d1",
			dark: "#78716c",
		},
		success: {
			main: "#22c55e",
			light: "#4ade80",
			dark: "#16a34a",
		},
		error: {
			main: "#ef4444",
			light: "#f87171",
			dark: "#dc2626",
		},
		warning: {
			main: "#f59e0b",
			light: "#fbbf24",
			dark: "#d97706",
		},
		background: {
			default: "#09090b", // Zinc 950
			paper: "#18181b", // Zinc 900
		},
		text: {
			primary: "#fafafa",
			secondary: "#a1a1aa", // Zinc 400
		},
	},
	typography: {
		fontFamily: [
			"'DM Sans'",
			"-apple-system",
			"BlinkMacSystemFont",
			'"Segoe UI"',
			"Roboto",
			"sans-serif",
		].join(","),
		h1: {
			fontFamily: "'DM Serif Display', serif",
			fontSize: "2.5rem",
			letterSpacing: "-0.02em",
		},
		h2: {
			fontFamily: "'DM Serif Display', serif",
			fontSize: "2rem",
			letterSpacing: "-0.01em",
		},
		h3: {
			fontFamily: "'DM Serif Display', serif",
			fontSize: "1.75rem",
		},
		h4: {
			fontFamily: "'DM Serif Display', serif",
			fontSize: "1.5rem",
		},
		h5: {
			fontFamily: "'DM Serif Display', serif",
			fontSize: "1.25rem",
		},
		h6: {
			fontFamily: "'DM Sans', sans-serif",
			fontSize: "1.125rem",
			fontWeight: 600,
			letterSpacing: "0.01em",
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
		borderRadius: 16,
	},
	components: {
		MuiCard: {
			styleOverrides: {
				root: {
					boxShadow:
						"0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -2px rgba(0, 0, 0, 0.4)",
					border: "1px solid rgba(255, 255, 255, 0.1)",
					backgroundColor: "#18181b",
				},
			},
		},
		MuiPaper: {
			styleOverrides: {
				elevation1: {
					boxShadow:
						"0 1px 3px 0 rgba(0, 0, 0, 0.5), 0 1px 2px -1px rgba(0, 0, 0, 0.5)",
				},
				elevation2: {
					boxShadow:
						"0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -2px rgba(0, 0, 0, 0.5)",
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

		// Non-blocking calculation yielding to paint
		await new Promise((resolve) =>
			requestAnimationFrame(() => setTimeout(resolve, 0)),
		);

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
							<Suspense fallback={<div>Loading form...</div>}>
								<SalaryInputForm onCalculate={handleCalculate} />
							</Suspense>
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
								<Suspense fallback={<div>Loading results...</div>}>
									<Box>
										{/* Income Distribution Chart */}
										<Box sx={{ mb: 4 }}>
											<TaxChart summary={summary} />
										</Box>

										{/* Analysis & Comparison Section */}
										<Box sx={{ mb: 4 }}>
											<Typography
												variant="h6"
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
								</Suspense>
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
								borderRadius: 4,
								border: "1px solid rgba(255, 255, 255, 0.1)",
								position: "relative",
								overflow: "hidden",
							}}
						>
							{/* Subtle glow effect behind card */}
							<Box
								sx={{
									position: "absolute",
									top: "-50%",
									left: "-50%",
									width: "200%",
									height: "200%",
									background:
										"radial-gradient(circle, rgba(59,130,246,0.1) 0%, rgba(9,9,11,0) 50%)",
									pointerEvents: "none",
									zIndex: 0,
								}}
							/>
							<Box sx={{ position: "relative", zIndex: 1 }}>
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
									qualified Chartered Accountant or tax advisor. This tool is
									for educational and planning purposes only.
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
					</Box>
				</Container>
			</Box>
		</ThemeProvider>
	);
}

export default App;
