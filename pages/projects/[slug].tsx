import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import NextImage from "next/image";

import Link from "@/components/Shared/Link";
import { allProjects, Project } from "contentlayer/generated";
import IconFactory from "@/components/Shared/Icons/IconFactory";
import { useMDXComponent } from "next-contentlayer/hooks";
import MDXComponents from "@/components/Common/MDXComponents";
import CustomGiscus from "@/components/Shared/CustomGiscus";
import { getGitHubOwnerAndRepoFromLink } from "@/utils/helpers";
import { GitHubLogo } from "@/components/Shared/Icons";
import getPreviewImageUrl from "@/utils/getPreviewImageURL";

interface ProjectPageProps {
  project: Project;
  projectImagePreview: string;
}

const SkillPage: NextPage<ProjectPageProps> = ({
  project,
  projectImagePreview,
}) => {
  const ProjectMDX = useMDXComponent(project.body.code);

  return (
    <>
      <div className="mt-8 flex space-x-8">
        <IconFactory
          name={project.iconName}
          className="shadow-md h-16 w-16 rounded-xl bg-tertiary p-2"
        />
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl font-bold">{project.name}</h1>
          <p className="text-sm text-gray-300">{project.description}</p>
        </div>
      </div>
      {project.link && (
        <Link href={project.link} className="mt-4 md:mt-6">
          {project.link}
        </Link>
      )}

      {project.githubLink && (
        <Link
          href={project.githubLink}
          className="mt-4 md:ml-4 md:mt-6"
          icon={<GitHubLogo />}
        >
          {getGitHubOwnerAndRepoFromLink(project.githubLink)}
        </Link>
      )}
      <div className="my-8 h-1 w-full rounded-full bg-secondary" />

      <div className="overflow-hidden rounded-xl">
        <NextImage
          width={project.image.width}
          height={project.image.height}
          src={project.image.url}
          className="rounded-xl"
          placeholder="blur"
          blurDataURL={projectImagePreview}
        />
      </div>

      <article>
        <div className="my-8 h-1 w-full rounded-full bg-secondary" />

        <div className="prose leading-8">
          <ProjectMDX components={{ ...MDXComponents }} />
        </div>
        <div className="my-8 h-1 w-full rounded-full bg-secondary" />
        <div className="rounded-xl border-[1px] border-tertiary p-8">
          <CustomGiscus term={`project: ${project.name}`} />
        </div>
      </article>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const project = allProjects.find(project => project.slug === params.slug);

  const projectImagePreview = await getPreviewImageUrl(project.image.url);

  return {
    props: {
      project,
      projectImagePreview,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = allProjects.map(project => ({
    params: { slug: project.slug },
  }));

  return {
    paths,
    fallback: false,
  };
};

export default SkillPage;
