import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useRecoilState } from "recoil";

import Layout, { siteTitle } from "../components/layout";
import { isClickTitleState } from "../grobalStates/isClickTitleStateAtom";
import { selectedTagState } from "../grobalStates/selectedTagAtom";
import { selectedPageState } from "../grobalStates/selectedPageAtom";
import { getPostsData } from "../lib/post";
import { PAGE_PER_POST } from "../lib/const";

import styles from "../styles/Home.module.css";
import utilStyles from "../styles/utils.module.css";

// SSG
export async function getStaticProps() {
  const allPostsData = getPostsData();
  const sortData = allPostsData.sort(
    (x, y) => -(new Date(x.date).getTime() - new Date(y.date).getTime())
  );
  // for Category
  const tags = allPostsData.map((d) => {
    return d.tags;
  });
  const tagsSet = new Set(tags.reduce((x, y) => [...x, ...y]));
  // for Archive
  const dates = sortData.map((d) => {
    return d.date;
  });
  const dateCountMap = new Map();
  let yearMonth;
  let dateCount;
  dates.forEach((d) => {
    // d.slice(0,7): yyyy-mm
    if (yearMonth === d.slice(0, 7)) {
      dateCount = dateCount + 1;
      dateCountMap.set(yearMonth, dateCount);
    } else {
      yearMonth = d.slice(0, 7);
      dateCount = 1;
      dateCountMap.set(yearMonth, dateCount);
    }
  });
  return {
    props: {
      allPostsData: sortData,
      allTags: [...tagsSet],
      dateCount: Object.fromEntries(dateCountMap),
    },
  };
}

export default function Home({ allPostsData, allTags, dateCount }) {
  const [searchKeyWork, setSearchKeyWord] = useState("");
  const [displayPostsData, setDisplayPostsData] = useState(allPostsData);
  const [isClickTitle, setIsClickTitle] = useRecoilState(isClickTitleState);
  const [selectedTag, setSelectedTag] = useRecoilState(selectedTagState);
  const [selectedPage, setSelectedPage] = useRecoilState(selectedPageState);

  const onClickTag = (tag) => {
    setSelectedTag(tag);
    setSelectedPage(0);
  };
  const onClickSearch = () => {
    const filterData = allPostsData.filter(
      (d) =>
        d.content.match(searchKeyWork) || String(d.tags).match(searchKeyWork)
    );
    setDisplayPostsData(filterData);
    setSelectedTag("");
    setSelectedPage(0);
  };

  const onClickReset = () => {
    setDisplayPostsData(allPostsData);
    setSelectedTag("");
    setSelectedPage(0);
  };
  const handlePageChange = (data) => {
    const pageNumber = data["selected"];
    setSelectedPage(pageNumber);
  };
  const onClickArchive = (date) => {
    const filterData = allPostsData.filter((d) =>
      d.date.slice(0, 7).match(date)
    );
    setDisplayPostsData(filterData);
    setSelectedTag("");
    setSelectedPage(0);
  };

  // 記事ページからタグを選択された時に対応するためuseEffectで監視する
  useEffect(() => {
    const filterData = allPostsData.filter((d) =>
      String(d.tags).match(selectedTag)
    );
    setIsClickTitle(false);
    setDisplayPostsData(filterData);
  }, [isClickTitle, selectedTag]);
  // 表示データが存在しないページ数が選択されている時に最初のページを強制移動する
  useEffect(() => {
    if (displayPostsData.length / PAGE_PER_POST < selectedPage) {
      setSelectedPage(0);
    }
  }, [selectedPage, displayPostsData]);

  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <div className={utilStyles.flexCenter}>
        <div className={styles.breadcrumbList}>
          <a onClick={onClickReset}>記事一覧</a>
          {selectedTag && (
            <>
              <span className={utilStyles.marginLR10}>{">"}</span>
              <a>{selectedTag}</a>
            </>
          )}
        </div>
        <div className={`${utilStyles.headingMd} ${utilStyles.center}`}>
          {displayPostsData.length === 0 ? (
            <div className={styles.notFound}>記事が見つかりません</div>
          ) : (
            <div>
              <div>
                {displayPostsData
                  .slice(
                    selectedPage * PAGE_PER_POST,
                    (selectedPage + 1) * PAGE_PER_POST
                  )
                  .map(({ id, title, date, thumbnail, tags }) => (
                    <div key={id} className={styles.grid}>
                      <Link href={`/posts/${id}`}>
                        <img
                          src={thumbnail}
                          className={styles.thumbnailImage}
                        />
                      </Link>
                      <div className={styles.blogInfo}>
                        <Link legacyBehavior href={`/posts/${id}`}>
                          <a className={utilStyles.boldText}>{title}</a>
                        </Link>
                        <br />
                        <div className={utilStyles.lightText}>{date}</div>
                        {tags.map((t) => (
                          <button
                            key={t}
                            className={utilStyles.tagsButton}
                            onClick={() => onClickTag(t)}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
              <div
                className={`${utilStyles.center} ${utilStyles.paddingTop50px}`}
              >
                <ReactPaginate
                  forcePage={selectedPage}
                  pageCount={Math.ceil(displayPostsData.length / PAGE_PER_POST)}
                  onPageChange={handlePageChange}
                  containerClassName={styles.pagination}
                  activeClassName={styles.active}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={2}
                  previousLabel={"<"}
                  nextLabel={">"}
                  breakLabel={"..."}
                />
              </div>
            </div>
          )}
          <div>
            <h2>Category</h2>
            <div className={styles.categoryArea}>
              {allTags.map((t) => (
                <button
                  key={t}
                  className={utilStyles.tagsButton}
                  onClick={() => setSelectedTag(t)}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className={`${utilStyles.center} ${styles.searchInput}`}>
              <input
                type="text"
                onInput={(e) => setSearchKeyWord(e.currentTarget.value)}
                placeholder={"記事を検索"}
              />
              <button className={styles.searchButton} onClick={onClickSearch}>
                検索
              </button>
            </div>
            <h2>Archive</h2>
            <div className={utilStyles.center}>
              <div className={styles.archiveArea}>
                {Object.keys(dateCount).map((date) => (
                  <div
                    key={date}
                    className={styles.archive}
                    onClick={() => onClickArchive(date)}
                  >
                    {date} ({dateCount[date]})
                  </div>
                ))}
              </div>
            </div>
            {/* TODO: 人気記事とか追加したら良さそう */}
          </div>
        </div>
      </div>
    </Layout>
  );
}
