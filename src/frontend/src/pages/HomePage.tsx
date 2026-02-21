import { useGetPosts } from '../hooks/useQueries';
import PostFeed from '../components/PostFeed';
import PlatformRules from '../components/PlatformRules';
import RandomDebateButton from '../components/RandomDebateButton';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  const { data: posts = [], isLoading } = useGetPosts();

  return (
    <div className="relative">
      {/* Hero Section */}
      <div
        className="relative h-[300px] md:h-[400px] bg-cover bg-center"
        style={{ backgroundImage: 'url(/assets/generated/hero-bg.dim_1920x600.png)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
        <div className="relative container h-full flex flex-col items-center justify-center text-center text-white space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold">Global Activist Debate</h1>
          <p className="text-lg md:text-xl max-w-2xl">Where ideas meet, opinions clash, and activists grow</p>
          <RandomDebateButton />
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Feed */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold">Latest Discussions</h2>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-48 w-full" />
                ))}
              </div>
            ) : (
              <PostFeed posts={posts} showPinnedFirst />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <PlatformRules />
          </div>
        </div>
      </div>
    </div>
  );
}
