import { Fragment, type ReactNode } from 'react';
import { getJobs, getNews, getProjects, getTeam, getVideos, type Section, type Settings } from '@/content';
import { useLocale } from '@/lib/locale';
import CallToActionBlock from './CallToActionBlock';
import CardGridBlock from './CardGridBlock';
import FormBlock from './FormBlock';
import GalleryBlock from './GalleryBlock';
import HeroBlock from './HeroBlock';
import JobsListBlock from './JobsListBlock';
import LatestWorkBlock from './LatestWorkBlock';
import NewsFeedBlock from './NewsFeedBlock';
import PageHeaderBlock from './PageHeaderBlock';
import PartnersBlock from './PartnersBlock';
import ProjectsGridBlock from './ProjectsGridBlock';
import { ProjectsFilterBar, ProjectsFilterProvider } from './projectsFilter';
import QuoteBlock from './QuoteBlock';
import RichTextBlock from './RichTextBlock';
import StatsBandBlock from './StatsBandBlock';
import TeamGridBlock from './TeamGridBlock';
import TextImageBlock from './TextImageBlock';
import VideoBlock from './VideoBlock';
import VideoGridBlock from './VideoGridBlock';

/** Draws a page's sections in the order editors set. */
export default function BlockRenderer({ sections, settings }: { sections: Section[]; settings: Settings }) {
  const locale = useLocale();

  // The projects filter bar belongs inside the page header right before the grid (as in the original design).
  const gridIndex = sections.findIndex((s) => s.type === 'projectsGrid');
  const grid = gridIndex >= 0 ? sections[gridIndex] : undefined;
  const filterHostIndex =
    grid?.type === 'projectsGrid' && grid.showFilters !== false && sections[gridIndex - 1]?.type === 'pageHeader' ? gridIndex - 1 : -1;

  const render = (s: Section, i: number): ReactNode => {
    switch (s.type) {
      case 'hero':
        return <HeroBlock block={s} />;
      case 'pageHeader':
        return <PageHeaderBlock block={s} below={i === filterHostIndex ? <ProjectsFilterBar /> : undefined} />;
      case 'richText':
        return <RichTextBlock block={s} />;
      case 'quote':
        return <QuoteBlock block={s} />;
      case 'cardGrid':
        return <CardGridBlock block={s} />;
      case 'statsBand':
        return <StatsBandBlock block={s} targetLabel={settings.ui.targetTag} />;
      case 'textImage':
        return <TextImageBlock block={s} />;
      case 'gallery':
        return <GalleryBlock block={s} />;
      case 'video':
        return <VideoBlock block={s} />;
      case 'partners':
        return <PartnersBlock block={s} />;
      case 'callToAction':
        return <CallToActionBlock block={s} />;
      case 'form':
        return <FormBlock block={s} settings={settings} />;
      case 'projectsGrid':
        return <ProjectsGridBlock block={s} projects={getProjects(locale)} settings={settings} filterInHeader={filterHostIndex >= 0} />;
      case 'latestWork':
        return <LatestWorkBlock block={s} />;
      case 'newsFeed':
        return <NewsFeedBlock block={s} news={getNews(locale)} settings={settings} />;
      case 'jobsList':
        return <JobsListBlock block={s} jobs={getJobs(locale)} />;
      case 'videoGrid':
        return <VideoGridBlock block={s} videos={getVideos(locale)} />;
      case 'teamGrid':
        return <TeamGridBlock block={s} team={getTeam(locale)} />;
    }
  };

  const content = sections.map((s, i) => <Fragment key={`${s.type}-${i}`}>{render(s, i)}</Fragment>);
  return grid?.type === 'projectsGrid' ? <ProjectsFilterProvider labels={grid.filterLabels}>{content}</ProjectsFilterProvider> : <>{content}</>;
}
