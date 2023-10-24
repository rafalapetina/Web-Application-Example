import { ContentBlock } from "../models/ContentBlock.js";
import { PageContent } from "../models/PageContent.js";
import { db } from "../config/db.js";

export const insertContentBlock = async (block) => {
  return new Promise((resolve, reject) => {
    const query =
      "INSERT INTO ContentBlocks (type, content, blockIndex) VALUES (?, ?, ?)";
    const values = [block.type, block.content, block.index];
    db.run(query, values, function (err) {
      if (err) reject(err);
      else resolve(this.lastID);
    });
  });
};

export const insertPageContent = async (pageContent, blockIds) => {
  return new Promise((resolve, reject) => {
    const query =
      "INSERT INTO Pages (authorId, authorUsername, creationDate, publicationDate, title, blocksIDs) " +
      "VALUES (?, ?, DATE(?), DATE(?), ?, ?)";
    const values = [
      pageContent.author,
      pageContent.authorUsername,
      pageContent.creationDate,
      pageContent.publicationDate,
      pageContent.title,
      JSON.stringify(blockIds),
    ];
    db.run(query, values, function (err) {
      if (err) reject(err);
      else resolve(this.lastID);
    });
  });
};

export const getAllPublishedPages = async () => {
  return new Promise((resolve, reject) => {
    const query =
      "SELECT * FROM Pages WHERE publicationDate <= DATE('now') ORDER BY publicationDate DESC";
    db.all(query, [], async (err, rows) => {
      if (err) reject(err);
      else {
        const pages = await resultToPageContent(rows);
        resolve(pages);
      }
    });
  });
};

export const getAllPagesFromAllAuthors = async () => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM Pages ORDER BY publicationDate DESC";
    db.all(query, [], async (err, rows) => {
      if (err) reject(err);
      else {
        const pages = await resultToPageContent(rows);
        resolve(pages);
      }
    });
  });
};

export const getContentBlockById = async (id) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM ContentBlocks WHERE id = ?";
    db.get(query, [id], (err, row) => {
      if (err) reject(err);
      else {
        const block = new ContentBlock(
          row.id,
          row.type,
          row.content,
          row.blockIndex
        );
        resolve(block);
      }
    });
  });
};

const resultToPageContent = async (rows) => {
  if (!rows || rows.length === 0) return [];
  const pages = [];
  for (const row of rows) {
    const blocks = JSON.parse(row.blocksIDs);
    const contentBlocks = [];
    for (const blockId of blocks) {
      const block = await getContentBlockById(blockId);
      contentBlocks.push(block);
    }
    const pageContent = new PageContent(
      row.id,
      row.title,
      row.authorId,
      row.authorUsername,
      row.creationDate,
      row.publicationDate,
      contentBlocks
    );
    pages.push(pageContent);
  }
  pages.sort((a, b) => {
    return a.index - b.index;
  });
  return pages;
};

export const deletePageBlocks = async (pageId) => {
  return new Promise((resolve, reject) => {
    const query =
      "DELETE FROM ContentBlocks WHERE id IN (SELECT blocksIDs FROM Pages WHERE id = ?)";
    db.run(query, [pageId], (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

export const deletePage = async (pageId) => {
  return new Promise((resolve, reject) => {
    const query = "DELETE FROM Pages WHERE id = ?";
    db.run(query, [pageId], (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

export const getPageById = async (id) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM Pages WHERE id = ?";
    db.get(query, [id], async (err, row) => {
      if (err) reject(err);
      else {
        const pages = await resultToPageContent([row]);
        resolve(pages[0]);
      }
    });
  });
};

export const updateBlocks = async (blocks) => {
  return new Promise((resolve, reject) => {
    const query =
      "UPDATE ContentBlocks SET type = ?, content = ?, blockIndex = ? WHERE id = ?";
    const promises = [];
    for (const block of blocks) {
      const values = [block.type, block.content, block.index, block.id];
      promises.push(
        new Promise((resolve, reject) => {
          db.run(query, values, (err) => {
            if (err) reject(err);
            else resolve();
          });
        })
      );
    }
    Promise.all(promises)
      .then(() => resolve())
      .catch((err) => reject(err));
  });
}

export const updatePage = async (page, blockIds) => {
  return new Promise((resolve, reject) => {
    const query =
      "UPDATE Pages SET title = ?, publicationDate = ?, blocksIDs = ?, authorId = ?, authorUsername = ? WHERE id = ?";
    const values = [
      page.title,
      page.publicationDate,
      JSON.stringify(blockIds),
      page.author,
      page.authorUsername,
      page.id,
    ];
    db.run(query, values, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}