import dayjs from "dayjs";
import ContentBlock from "./ContentBlock";

export class PageContent {
  constructor(id, title, author, authorUsername, creationDate, publicationDate, blocks) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.authorUsername = authorUsername;
    this.creationDate = dayjs(creationDate);
    this.publicationDate = publicationDate ? dayjs(publicationDate) : '';
    this.blocks = blocks;
  }

  serialize() {
    return {
      id: this.id,
      title: this.title,
      author: this.author,
      authorUsername: this.authorUsername,
      creationDate: this.creationDate.format("YYYY-MM-DD"),
      publicationDate: this.publicationDate
        ? this.publicationDate.format("YYYY-MM-DD")
        : null,
      blocks: this.blocks.map((block) => block.serialize()),
    };
  }

  static fromJson(json) {
    return new PageContent(
      json.id,
      json.title,
      json.author,
      json.authorUsername,
      json.creationDate,
      json.publicationDate,
      ContentBlock.fromJsonArray(json.blocks)
    );
  }

  static fromJsonArray(jsonArray) {
    return jsonArray.map((json) => PageContent.fromJson(json));
  }
}
