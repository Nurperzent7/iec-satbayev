import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";

import BlogMeta from "@/components/news/blog-meta";
import MDHeading from "@/components/news/md-heading";
import { getNewsEntry } from "@/lib/news/utils";
import { redirect } from "next/navigation";

export const generateMetadata = async (
  props: {
    params: Promise<{ lang: string, slug: string }>;
  }
): Promise<Metadata> => {
  const params = await props.params;
  const entry = await getNewsEntry(params.lang, params.slug);
  if (!entry) {
    return {
      title: "News",
      description: "News",
    };
  }
  const { data } = entry;
  return {
    title: data.title,
    description: data.description,
    icons: ["https://satbayev.university/favicon.ico"],
    openGraph: {
      title: data.title,
      description: data.description,
      type: "article",
      publishedTime: data.date,
    },
    twitter: {
      title: data.title,
      description: data.description,
    },
  };
};

export default async function NewsPostPage({ params }: { params: Promise<{ lang: string, slug: string }> }) {
  // Get all labs data
  const { lang, slug }: { lang: string, slug: string } = await params;
  const entry = await getNewsEntry(lang, slug);
  if (!entry) {
    redirect(`/${lang}/news`);
  }
  const { data, content } = entry;
  return (
    <>
      <div className="mt-12 flex justify-center flex-col items-center">
        <BlogMeta data={data} />
        <article className="flex flex-col z-30 md:w-[700px] w-full px-8 md:px-0">
          <div className="pt-4 pb-8">
            <MDXRemote
              source={content}
              components={{
                h1: (props) => <MDHeading props={props} level={0} />,
                h2: (props) => <MDHeading props={props} level={1} />,
                h3: (props) => <MDHeading props={props} level={2} />,
                h4: (props) => <MDHeading props={props} level={3} />,
                p: (props) => <p className="py-2" {...props} />,
                a: (props) => <a className="underline" target="_blank" rel="noopener noreferrer" {...props} />,
                blockquote: (props) => <blockquote className="border-l-2 border-primary pl-4 py-2" {...props} />,
                // codeblock
                // pre: (props) => <PreHighlighter className="pl-4 py-4" {...props} />,
                // inline code
                code: (props) => <span className="text-sm bg-secondary rounded font-mono px-1.5 py-0.5" {...props} />,
                ul: (props) => <ul className="list-disc pl-4" {...props} />,
                ol: (props) => <ol className="list-decimal pl-4" {...props} />,
                img: (props) => <img className="md:w-[1000px] relative w-full border rounded-lg" {...props} />,
              }}
            />
          </div>
        </article>
      </div>
    </>
  );
}
