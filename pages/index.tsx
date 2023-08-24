import Head from 'next/head'
import { GetStaticProps } from 'next'
import Container from '../components/container'
import MoreStories from '../components/more-stories'
import HeroPost from '../components/hero-post'
import Intro from '../components/intro'
import Layout from '../components/layout'
import { getAllPageTitles, getAllPostsForHome } from '../lib/api'
import { CMS_NAME } from '../lib/constants'

export default function Index({ allPosts: { edges }, pageTitles, preview }) {
  const heroPost = edges[0]?.node
  const morePosts = edges.slice(1)
  const morePages = pageTitles.edges

  return (
    <Layout preview={preview}>
      <Head>
        <title>{`Next.js com ${CMS_NAME}`}</title>
      </Head>
      <Container>
        <Intro />
        {heroPost && (
          <HeroPost
            title={heroPost.title}
            coverImage={heroPost.featuredImage}
            date={heroPost.date}
            author={heroPost.author}
            slug={heroPost.slug}
            excerpt={heroPost.excerpt}
          />
        )}
        {morePosts.length > 0 && <MoreStories posts={morePosts} />}
        <h1>Páginas criadas no wordpress:</h1>
        {morePages.length > 0 && morePages.map(pageTitle => (
          <li key={pageTitle.node.uri}>
            <a href={`/pages/${pageTitle.node.uri}`}>{pageTitle.node.title}</a>
          </li>
        ))}
      </Container>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ preview = false }) => {
  const allPosts = await getAllPostsForHome(preview)
  const pageTitles = await getAllPageTitles()

  return {
    props: { allPosts, pageTitles, preview },
    revalidate: 10,
  }
}
