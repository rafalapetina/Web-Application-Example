import {
  Box,
  Grid,
  Typography,
  Divider,
  Stack,
  Button,
  Container,
} from "@mui/material";
import ActionsAreaCard from "../components/PageCard";
import { useNavigate } from "react-router-dom";

function MainPage(props) {
  const navigate = useNavigate();
  const publishedPages = props.pages;

  return (
    <Container disableGutters maxWidth={false}>
      <Box sx={{ pr: "20px", pl: "20px", pb: "20px" }}>
        <Stack direction={"row"}>
          <Typography variant="h4" gutterBottom sx={{ flexGrow: 1 }}>
            Front Office
          </Typography>
          {props.user.id ? (
            <Button
              variant="outlined"
              color="primary"
              size="small"
              sx={{ height: "2.5rem" }}
              onClick={() => {
                navigate("/back-office");
              }}
            >
              Go to Back Office
            </Button>
          ) : (
            <> </>
          )}
        </Stack>
        <Grid container spacing={2}>
          {publishedPages ? (
            publishedPages.map((page) => (
              <Grid item key={page.id} xs={12} sm={6} md={4} lg={3}>
                <ActionsAreaCard
                  page={page}
                  user={props.user}
                ></ActionsAreaCard>
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

export default MainPage;
