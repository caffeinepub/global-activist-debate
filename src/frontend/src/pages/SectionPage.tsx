import { useGetPosts } from '../hooks/useQueries';
import PostFeed from '../components/PostFeed';
import CreatePostForm from '../components/CreatePostForm';
import PlatformRules from '../components/PlatformRules';
import { SectionType } from '../backend';
import { Skeleton } from '@/components/ui/skeleton';

interface SectionPageProps {
  section: SectionType;
}

export default function SectionPage({ section }: SectionPageProps) {
  const { data: allPosts = [], isLoading } = useGetPosts();
  const posts = allPosts.filter((p) => p.section === section);

  const getSectionInfo = () => {
    switch (section) {
      case SectionType.civilDebate:
        return {
          title: 'Civil Debate',
          description: 'Respectful discussions focused on ideas and opinions.',
          icon: '/assets/generated/civil-icon.dim_128x128.png',
        };
      case SectionType.aggressiveDebate:
        return {
          title: 'Aggressive Debate',
          description: 'Heated debates where passion meets discourse. Cursing about topics allowed, not people.',
          icon: '/assets/generated/aggressive-icon.dim_128x128.png',
        };
      case SectionType.quotesPoems:
        return {
          title: 'Quotes & Poems',
          description: 'Share your activist voice through creative expression.',
          icon: '/assets/generated/quotes-icon.dim_128x128.png',
        };
      case SectionType.randomDebates:
        return {
          title: 'Random Debates',
          description: 'Looking for a debate partner? Post here or find someone to engage with.',
          icon: '/assets/generated/random-icon.dim_128x128.png',
        };
      default:
        return {
          title: 'Debate Section',
          description: 'Share your thoughts and engage with others.',
          icon: '/assets/generated/civil-icon.dim_128x128.png',
        };
    }
  };

  const info = getSectionInfo();

  return (
    <div className="container py-8">
      {/* Section Header */}
      <div className="flex items-center gap-4 mb-8">
        <img src={info.icon} alt={info.title} className="h-16 w-16" />
        <div>
          <h1 className="text-3xl font-bold">{info.title}</h1>
          <p className="text-muted-foreground">{info.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Feed */}
        <div className="lg:col-span-2 space-y-6">
          <CreatePostForm section={section} />
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-48 w-full" />
              ))}
            </div>
          ) : (
            <PostFeed posts={posts} />
          )}
        </div>

        {/* Sidebar */}
        <div>
          <PlatformRules />
        </div>
      </div>
    </div>
  );
}
