import Head from "next/head";
import { useRouter } from "next/router";
import { useSetRecoilState } from "recoil";

import Layout from "../../components/layout";
import { selectedTagState } from "../../grobalStates/selectedTagAtom";
import { selectedPageState } from "../../grobalStates/selectedPageAtom";
import { getAllPostsIds, getPostData } from "../../lib/post";
import utilStyles from "../../styles/utils.module.css";

export const getStaticPaths = async () => {
  const paths = getAllPostsIds();

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params }) => {
  const postData = await getPostData(params.id);
  return {
    props: {
      postData,
    },
  };
};

const Post = ({ postData }) => {
  const router = useRouter();
  const setSelectedTag = useSetRecoilState(selectedTagState);
  const setSelectedPage = useSetRecoilState(selectedPageState);
  const onClickTag = (t) => {
    setSelectedTag(t);
    setSelectedPage(0);
    router.push("/");
  };
  return (
    <Layout>
      <div className={`${utilStyles.blogArea} ${utilStyles.spaceBetween}`}>
        <div
          className={`${utilStyles.contentArea} ${utilStyles.blogMessageMinHeihgt}`}
        >
          <Head>
            <title>{postData.title}</title>
          </Head>
          <article>
            <h1 className={utilStyles.headingXl}>{postData.title}</h1>
            <div className={utilStyles.lightText}>{postData.date}</div>
            <div>
              {postData.tags.map((t) => (
                <button
                  key={t}
                  className={utilStyles.tagsButton}
                  onClick={() => onClickTag(t)}
                >
                  {t}
                </button>
              ))}
            </div>

            <div
              dangerouslySetInnerHTML={{ __html: postData.blobContentHTML }}
            ></div>
          </article>
        </div>
        <div className={utilStyles.headlineArea}>
          <div>TODO: 目次</div>
          <div>TODO: スクロール追従</div>
        </div>
      </div>
    </Layout>
  );
};

export default Post;
