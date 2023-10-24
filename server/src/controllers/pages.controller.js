import passport from "passport";
import { strategy } from "../config/configs.js";
import { PageContent } from "../models/PageContent.js";
import {
  insertContentBlock,
  insertPageContent,
  getAllPublishedPages as getAllPublishedPagesFromDB,
  deletePageBlocks,
  deletePage,
  getPageById,
  updatePage,
  updateBlocks,
  getAllPagesFromAllAuthors,
} from "../services/pages.services.js";

passport.use(strategy);

export const saveNewPageContent = async (req, res) => {
  try {
    const pageContent = PageContent.fromJson(req.body);
    if (!pageContent) {
      return res.status(400).json({ error: "Invalid page content" });
    }
    const blockIds = [];
    for (const block of pageContent.blocks) {
      const blockId = await insertContentBlock(block);
      blockIds.push(blockId);
    }
    const pageContentId = await insertPageContent(pageContent, blockIds);
    res.status(200).json({ id: pageContentId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllPages = async (req, res) => {
  try {
    const publishedPages = await getAllPublishedPagesFromDB();
    let userPages = [];
    if (req.user) userPages = await getAllPagesFromAllAuthors();
    res
      .status(200)
      .json({ publishedPages: publishedPages, userPages: userPages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deletePageById = async (req, res) => {
  try {
    const id = req.params.id;
    await deletePageBlocks(id);
    await deletePage(id);
    res.status(200).json({ id: id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updatePageContent = async (req, res) => {
  try {
    const id = req.params.id;
    const pageContent = PageContent.fromJson(req.body);
    if (!pageContent) {
      return res.status(400).json({ error: "Invalid page content" });
    }
    const pageInDb = await getPageById(id);
    const newBlocks = pageContent.blocks.filter(
      (block) => !pageInDb.blocks.find((b) => b.id === block.id)
    );
    const blocksToUpdate = pageContent.blocks.filter((block) =>
      pageInDb.blocks.find((b) => b.id === block.id)
    );
    const blockIds = [];
    for (const block of newBlocks) {
      const blockId = await insertContentBlock(block);
      blockIds.push(blockId);
    }
    for (const block of blocksToUpdate) {
      await updateBlocks(blocksToUpdate);
      blockIds.push(block.id);
    }
    await updatePage(pageContent, blockIds);
    res.status(200).json({ id: id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
