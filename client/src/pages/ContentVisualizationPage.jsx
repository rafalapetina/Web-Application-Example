import { Chip, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useLocation } from "react-router-dom";
import { PageContent } from "../models/PageContent";

function ContentVisualizationPage() {
  const location = useLocation();
  const page = PageContent.fromJson(location.state.page);
  const status = page.publicationDate
    ? page.publicationDate > page.creationDate
      ? "Scheduled to " + page.publicationDate.format("DD/MM/YYYY")
      : `Published: ${page.publicationDate.format("DD/MM/YYYY")}`
    : "Draft";
  const borderColor =
    status === "Draft" ? "red" : status === "Scheduled" ? "yellow" : "green";
  return (
    <Stack
      sx={{ mr: 15, p: "20px", ml: 15 }}
      direction="column"
      justifyContent="flex-start"
      alignItems="strech"
      spacing={2}
      flexWrap={"nowrap"}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={1}
      >
        <Typography variant="h3" gutterBottom sx={{ flexGrow: 1, fontWeight: "light" }}>
          {page.title}
        </Typography>
        <Stack direction="column" justifyContent="center" alignItems="flex-end">
          <Typography variant="h6" sx={{ pr: "10px", }}>
            Author: {page.authorUsername}
          </Typography>
          <Chip
            label={status}
            sx={{ border: 1, borderColor: borderColor, borderRadius: 5 }}
          />
        </Stack>
      </Stack>
        {page.blocks.map((block) => {
          if (block.type === "Paragraph") {
            return (
              <Typography key={block.id} variant="body1" sx={{ flexGrow: 1 }}>
                {block.content}
              </Typography>
            );
          }
          if (block.type === "Image") {
            return <img height={450} width={600} src={`.././src/assets/${block.content}`} alt="image" />;
          }
          if (block.type === "Header") {
            return (
              <Typography key={block.id} variant="h5" sx={{ flexGrow: 1 }}>
                {block.content}
              </Typography>
            );
          }
        })}
    </Stack>
  );
}

export default ContentVisualizationPage;
