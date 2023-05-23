import path from "path";
import fs from "fs";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const postsDirectory = path.join(process.cwd(), "posts");

// mdファイルのデータを取り出す
export function getPostsData() {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/, ""); // file name
    // マークダウンファイルを文字列として読み取る
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    const matterResult = matter(fileContents);

    // idとデータを返す.
    return {
      id,
      ...matterResult.data,
      content: matterResult.content,
    };
  });
  return allPostsData;
}

//getStaticPathでreturnで使うpathを取得する
export const getAllPostsIds = () => {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ""),
      },
    };
  });
};

// idに基づいてブログ投稿データを返す
export const getPostData = async (id) => {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContent = fs.readFileSync(fullPath, "utf-8");

  const matterResult = matter(fileContent);
  const blobContent = await remark().use(html).process(matterResult.content);
  const blobContentHTML = blobContent.toString();

  return {
    id,
    blobContentHTML,
    ...matterResult.data,
  };
};
