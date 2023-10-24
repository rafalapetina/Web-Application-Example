import { Box, Button, Container, Divider, Grid, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ActionAreaCard from "../components/PageCard";

function BackOfficePage(props) {
  const navigate = useNavigate();

  return (
    <Container disableGutters maxWidth={false}>
      <Box sx={{ pr: "20px", pl: "20px", pb: "20px" }}>
        <Stack direction={"row"}>
          <Typography variant="h4" gutterBottom sx={{ flexGrow: 1 }}>
            Back Office
          </Typography>
          <Button
            variant="contained"
            color="success"
            size="small"
            sx={{ height: "2.5rem" }}
            onClick={() => {
              navigate("/page/new");
            }}
          >
            Create New Page
          </Button>
        </Stack>

        <Grid container spacing={2}>
          {props.pages ? (
            props.pages.map((page) => (
              <Grid item key={page.id} xs={12} sm={6} md={4} lg={3}>
                <ActionAreaCard
                  page={page}
                  user={props.user}
                  deletePage={props.deletePage}
                ></ActionAreaCard>
              </Grid>
            ))
          ) : (
            <></>
          )}
        </Grid>
      </Box>
    </Container>
  );
}

export default BackOfficePage;