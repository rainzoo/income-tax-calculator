import { Receipt } from "@mui/icons-material";
import {
	Box,
	Divider,
	Grid,
	InputAdornment,
	TextField,
	Typography,
} from "@mui/material";
import { memo } from "react";
import { FORM_CONSTANTS } from "../constants/taxRules.js";

const DeductionsSection = memo(function DeductionsSection({
	formData,
	handleChange,
	getDisplayValue,
}) {
	return (
		<Box
			sx={{
				p: 3,
				mb: 4,
				borderRadius: 2,
				bgcolor: "secondary.light",
				background: "linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)",
			}}
		>
			<Box display="flex" alignItems="center" mb={3}>
				<Receipt sx={{ mr: 2, color: "secondary.main", fontSize: 28 }} />
				<Box>
					<Typography variant="h6" fontWeight="semibold">
						Tax Deductions
					</Typography>
					<Typography variant="body2" color="text.secondary">
						Applicable only for Old Tax Regime
					</Typography>
				</Box>
			</Box>

			<Divider sx={{ mb: 3 }} />

			<Grid container spacing={3}>
				<Grid size={12}>
					<TextField
						fullWidth
						label="Section 80C Deductions"
						name="section80C"
						value={getDisplayValue("section80C", formData.section80C)}
						onChange={handleChange}
						type="text"
						inputProps={{ max: 150000 }}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">₹</InputAdornment>
							),
						}}
						helperText={`Max ₹${FORM_CONSTANTS.SECTION_80C_LIMIT.toLocaleString("en-IN")} | EPF, PPF, ELSS, Life Insurance, etc.`}
					/>
				</Grid>

				<Grid size={12}>
					<TextField
						fullWidth
						label="Section 80D - Health Insurance"
						name="section80D"
						value={getDisplayValue("section80D", formData.section80D)}
						onChange={handleChange}
						type="text"
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">₹</InputAdornment>
							),
						}}
						helperText="Self/Family: ₹25K | Parents: ₹50K"
					/>
				</Grid>

				<Grid size={12}>
					<TextField
						fullWidth
						label="Section 24(b) - Home Loan Interest"
						name="section24B"
						value={getDisplayValue("section24B", formData.section24B)}
						onChange={handleChange}
						type="text"
						inputProps={{ max: 200000 }}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">₹</InputAdornment>
							),
						}}
						helperText={`Max ₹${FORM_CONSTANTS.SECTION_24B_LIMIT.toLocaleString("en-IN")} | Interest paid on home loan`}
					/>
				</Grid>

				<Grid size={12}>
					<TextField
						fullWidth
						label="Other Deductions"
						name="otherDeductions"
						value={getDisplayValue("otherDeductions", formData.otherDeductions)}
						onChange={handleChange}
						type="text"
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">₹</InputAdornment>
							),
						}}
						helperText="Section 80G, 80TTA, 80EE, etc."
					/>
				</Grid>
			</Grid>
		</Box>
	);
});

DeductionsSection.displayName = "DeductionsSection";

export default DeductionsSection;
