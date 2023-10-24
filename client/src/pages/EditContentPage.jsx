import {
  Stack,
  Typography,
  Button,
  TextField,
  Chip,
  MenuItem,
  ImageList,
  ImageListItem,
  Autocomplete,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useEffect, useState } from "react";
import ContentBlock from "../models/ContentBlock";
import { PageContent } from "../models/PageContent";
import { useNavigate, useLocation } from "react-router-dom";
import dayjs from "dayjs";
import userAPI from "../services/users.api";

function EditContentPage(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const init = true;
  const contentTypes = ["Header", "Paragraph", "Image"];
  const imagePaths = [
    "cooking.jpg",
    "sports.jpg",
    "technology.jpg",
    "music.jpeg",
    "travel.jpeg",
    "movies.jpeg",
  ];
  const commonPath =
    location.pathname === "../page/new"
      ? ".././src/assets/"
      : "../.././src/assets/";
  const pageContent = location.state?.page
    ? PageContent.fromJson(location.state.page)
    : new PageContent(
        null,
        "",
        props.user.id,
        props.user.username,
        Date.now(),
        "",
        []
      );
  const [title, setTitle] = useState(pageContent.title ?? "");
  const [author, setAuthor] = useState(
    pageContent.authorUsername ?? props.user.username
  );
  const [publicationDate, setPublicationDate] = useState(
    pageContent.publicationDate
      ? pageContent.publicationDate.format("YYYY-MM-DD")
      : ""
  );
  const [contentBlocks, setContentBlocks] = useState(pageContent.blocks);
  const imagesArray = [];
  pageContent.blocks.forEach((block) =>
    block.type === "Image" ? imagesArray.push(true) : imagesArray.push(false)
  );
  const [isBlockImage, setIsBlockImage] = useState(imagesArray);
  const userObj = {
    username: pageContent.authorUsername,
    id: pageContent.author,
  };
  const [allUsers, setAllUsers] = useState([userObj]);
  const [selectedAuthor, setSelectedAuthor] = useState(allUsers[0]);

  useEffect(() => {
    const getAllUsers = async () => {
      const users = await userAPI.getAllUsers();
      const newUsers = [];
      users.forEach((user) => {
        if (!allUsers.find((u) => u.id === user.id))
          newUsers.push({ username: user.username, id: user.id });
      });
      setAllUsers([...allUsers, ...newUsers]);
    };
    getAllUsers();
  }, [init]);

  const handleAddContentBlock = () => {
    setContentBlocks([
      ...contentBlocks,
      new ContentBlock(null, "Header", "", contentBlocks.length),
    ]);
    setIsBlockImage([...isBlockImage, false]);
  };

  const handleContentChange = (event, index) => {
    const updatedContentBlocks = [...contentBlocks];
    updatedContentBlocks[index].content = event.target.value;
    setContentBlocks(updatedContentBlocks);
  };

  const handleRemoveContentBlock = (index) => {
    const updatedContentBlocks = contentBlocks.filter((_, i) => i !== index);
    isBlockImage.splice(index, 1);
    setIsBlockImage([...isBlockImage]);
    setContentBlocks(updatedContentBlocks);
  };

  const handleTypeChange = (value, index) => {
    const updatedContentBlocks = [...contentBlocks];
    updatedContentBlocks[index].type = value;

    if (value === "Image") {
      isBlockImage[index] = true;
      setIsBlockImage([...isBlockImage]);
    } else {
      isBlockImage[index] = false;
      setIsBlockImage([...isBlockImage]);
    }
    setContentBlocks([...updatedContentBlocks]);
  };

  const handleSelectImage = (imgPath, blockIndex) => {
    contentBlocks[blockIndex].content = imgPath;
    setContentBlocks([...contentBlocks]);
  };

  const hasCorrectNumberOfBlocks = () => {
    const headerIndex = contentBlocks.findIndex((obj) => obj.type === "Header");
    const otherBlocksIndex = contentBlocks.findIndex(
      (obj) => obj.type === "Paragraph" || obj.type === "Image"
    );
    return (
      contentBlocks.length !== 0 &&
      headerIndex !== -1 &&
      otherBlocksIndex !== -1
    );
  };

  const handleSavePage = async () => {
    // Perform necessary validation and save the page data
    pageContent.blocks = contentBlocks;
    pageContent.title = title;
    pageContent.authorUsername = selectedAuthor.username;
    pageContent.author = selectedAuthor.id;
    pageContent.publicationDate = dayjs(publicationDate);
    if (!pageContent.title) {
      props.setMessage({ text: "Title cannot be empty", type: "warning" });
      return;
    }
    if (!hasCorrectNumberOfBlocks()) {
      props.setMessage({
        text: "Page must contain at least one Header block and one Paragraph or Image block",
        type: "warning",
      });
      return;
    }
    if (pageContent.authorUsername === "" || !selectedAuthor) {
      props.setMessage({ text: "Author cannot be empty", type: "warning" });
      return;
    }
    if (!contentBlocks.every((obj) => obj.content !== "")) {
      props.setMessage({
        text: "All content blocks must be filled in",
        type: "warning",
      });
      return;
    }
    const success = await props.addNewOrEditPage(
      pageContent,
      location.pathname
    );
    if (success) navigate(-1);
  };

  const handleMoveBlock = (index, isMoveUp) => {
    const nextIndex = isMoveUp ? index - 1 : index + 1;
    if (
      (isMoveUp && index > 0) ||
      (!isMoveUp && index < contentBlocks.length - 1)
    ) {
      const updatedContentBlocks = [...contentBlocks];
      const temp = updatedContentBlocks[index];
      updatedContentBlocks[index] = updatedContentBlocks[nextIndex];
      updatedContentBlocks[nextIndex] = temp;
      swapIsImage(index, nextIndex);
      setContentBlocks([...updatedContentBlocks]);
    }
  };

  const swapIsImage = (index, index2) => {
    const temp = isBlockImage[index];
    isBlockImage[index] = isBlockImage[index2];
    isBlockImage[index2] = temp;
    setIsBlockImage([...isBlockImage]);
  };

  return (
    <Stack
      sx={{ pr: "20px", p: "20px", pl: "20px" }}
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
        <TextField
          margin="normal"
          required
          fullWidth
          name="title"
          label="Title"
          id="title"
          onChange={(event) => {
            setTitle(event.target.value);
          }}
          value={title}
        />
        <Stack direction="column" justifyContent="center" alignItems="flex-end">
          {props.user.role !== "admin" ? (
            <Typography variant="body2" sx={{ pr: "10px" }}>
              Author: {author}
            </Typography>
          ) : (
            <></>
          )}
          <Chip
            label={`Creation Date: ${pageContent.creationDate.format(
              "DD/MM/YYYY"
            )}`}
          />
        </Stack>
      </Stack>
      {props.user.role === "admin" ? (
        <Autocomplete
          value={selectedAuthor}
          onChange={(_, newValue) => {
            setSelectedAuthor(newValue);
          }}
          getOptionLabel={(option) => (option.username ? option.username : "")}
          id="author"
          options={allUsers}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Author" />}
        />
      ) : (
        <></>
      )}
      <TextField
        label="Publication Date"
        type="date"
        variant="outlined"
        InputLabelProps={{
          shrink: true,
        }}
        fullWidth
        value={publicationDate}
        onChange={(event) => {
          setPublicationDate(event.target.value);
        }}
      />
      <Button
        style={{ maxWidth: "200px" }}
        variant="outlined"
        onClick={handleAddContentBlock}
      >
        Add Content Block
      </Button>
      {contentBlocks.map((block, index) => (
        <Stack
          spacing={1}
          sx={{ border: 1, borderColor: "primary.main", borderRadius: 2, p: 1 }}
          key={index}
        >
          <TextField
            id="outlined-select-currency"
            select
            label="Block Type"
            value={block.type}
            sx={{ maxWidth: "200px" }}
            onChange={(event) => handleTypeChange(event.target.value, index)}
          >
            {contentTypes.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          {isBlockImage[index] ? (
            <>
              <ImageList cols={4} rows={1} rowHeight={250}>
                {imagePaths.map((imagePath) => (
                  <ImageListItem
                    key={imagePath}
                    sx={{
                      ":hover": {
                        cursor: "pointer",
                        opacity: 0.8,
                        border: `solid 1px blue`,
                      },
                      border:
                        contentBlocks[index].content === imagePath
                          ? `solid 3px red`
                          : `solid 1px transparent`,
                    }}
                  >
                    <img
                      src={`${commonPath}${imagePath}`}
                      srcSet={`${commonPath}${imagePath} 2x`}
                      loading="lazy"
                      onClick={() => handleSelectImage(imagePath, index)}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            </>
          ) : (
            <TextField
              label="Content"
              fullWidth
              multiline
              maxRows={8}
              InputLabelProps={{
                shrink: true,
              }}
              value={block.content}
              onChange={(event) => handleContentChange(event, index)}
            />
          )}
          <Stack direction="row" justifyContent="flex-start" spacing={1}>
            <Button
              variant="outlined"
              onClick={() => handleRemoveContentBlock(index)}
              sx={{ maxWidth: "120px" }}
            >
              Remove
            </Button>
            <Button
              variant="contained"
              onClick={() => handleMoveBlock(index, true)}
              sx={{ width: "50px", backgroundColor: "darkgoldenrod" }}
            >
              <ArrowUpwardIcon />
            </Button>
            <Button
              variant="contained"
              onClick={() => handleMoveBlock(index, false)}
              sx={{ width: "50px", backgroundColor: "darkcyan" }}
            >
              <ArrowDownwardIcon />
            </Button>
          </Stack>
        </Stack>
      ))}
      <Button
        variant="contained"
        color="success"
        size="small"
        sx={{ height: "2.5rem", width: "200px", alignSelf: "center" }}
        onClick={() => {
          handleSavePage();
        }}
      >
        Save Page
      </Button>
    </Stack>
  );
}
export default EditContentPage;
