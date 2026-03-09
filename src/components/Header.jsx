import CalculateIcon from "@mui/icons-material/Calculate";
import { AppBar, Box, Container, Toolbar, Typography } from "@mui/material";

export default function Header() {
	return (
		<AppBar
			position="static"
			sx={{
				background:
					"linear-gradient(180deg, rgba(9,9,11,1) 0%, rgba(24,24,27,1) 100%)",
				boxShadow: "0 4px 30px rgba(0, 0, 0, 0.5)",
				mb: 4,
				borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
				borderRadius: 0,
			}}
		>
			<Container maxWidth="xl">
				<Toolbar disableGutters sx={{ py: 3, justifyContent: "center" }}>
					<Box sx={{ display: "flex", alignItems: "center" }}>
						<Box
							sx={{
								backgroundColor: "rgba(255, 255, 255, 0.15)",
								borderRadius: 2,
								p: 1,
								mr: 2,
								backdropFilter: "blur(10px)",
								border: "1px solid rgba(255, 255, 255, 0.2)",
							}}
						>
							<CalculateIcon sx={{ fontSize: 28, color: "white" }} />
						</Box>
						<Typography
							variant="h4"
							component="h1"
							sx={{
								fontFamily: "'DM Serif Display', serif",
								color: "primary.main",
								textShadow: "0 2px 10px rgba(59, 130, 246, 0.2)",
							}}
						>
							Indian Income Tax Calculator
						</Typography>
					</Box>
				</Toolbar>
			</Container>
		</AppBar>
	);
}
