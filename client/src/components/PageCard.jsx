import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea, Button, Stack } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate, useLocation } from "react-router-dom";

function ActionAreaCard(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const page = props.page;
  const canEdit =
    (page.author == props.user.id || props.user.role == "admin") &&
    location.pathname === "/back-office";
  const status = page.publicationDate
    ? page.publicationDate > page.creationDate
      ? "Scheduled " + `${page.publicationDate.format("DD/MM/YYYY")}` 
      : `${page.publicationDate.format("DD/MM/YYYY")}`
    : "Draft";
  const image = page.blocks.find((block) => block.type === "Image")?.content;

  const description = page.blocks
    .filter((block) => block.type === "Paragraph")
    .map((block) => block.content + " ");

  return (
    <Card sx={{ maxWidth: "380px", height: "400px" }}>
      <CardActionArea
        onClick={() => {
          navigate(`/page/${page.id}`, { state: { page: page.serialize() } });
        }}
      >
        <CardMedia
          component="img"
          height="140px"
          image={image ? `./src/assets/${image}` : "./src/assets/noimage.png"}
          alt="image"
        />
        <CardContent sx={{ height: "200px" }}>
          <Typography
            variant="h5"
            sx={{
              display: "-webkit-box",
              overflow: "hidden",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
            }}
          >
            {page.title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: "-webkit-box",
              overflow: "hidden",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 6,
            }}
          >
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <Stack direction={"row"} spacing={1} sx={{ m: "10px" }}>
        <Typography sx={{ flexGrow: 1 }}>{status}</Typography>
        {canEdit ? (
          <Stack direction={"row"} spacing={1}>
            <Button
              color="secondary"
              startIcon={<EditIcon />}
              size="small"
              onClick={() => {
                navigate(`/page/${page.id}/edit`, {
                  state: { page: page.serialize() },
                });
              }}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              size="small"
              onClick={async () => {
                await props.deletePage(page.id);
              }}
            >
              Delete
            </Button>
          </Stack>
        ) : (
          <Stack direction={"row"} sx={{ mb: "10px", mt: "10px" }}>
            <Typography sx={{ flexGrow: 1 }}>{page.authorUsername}</Typography>
          </Stack>
        )}
      </Stack>
    </Card>
  );
}

export default ActionAreaCard;
