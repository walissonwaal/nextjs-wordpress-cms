import { useRouter } from 'next/router';
import { getPageBySlug, getAllPagesWithSlug } from '../../lib/api';

export default function Page({ page }) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{page.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: page.content }} />
    </div>
  );
}

export async function getStaticPaths() {
  const pages = await getAllPagesWithSlug();
  const paths = pages.edges.map((page) => ({
    params: { slug: page.node.uri },
  }));

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const { slug } = params;
  const page = await getPageBySlug(slug);

  return {
    props: {
      page,
    },
    revalidate: 3600, // 1 hr para revalidação
  };
}
