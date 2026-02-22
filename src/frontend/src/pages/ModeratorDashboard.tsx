import { useGetReports, useIsAdmin } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import ReportList from '../components/ReportList';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { ReportStatus } from '../backend';

export default function ModeratorDashboard() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: reports = [], isLoading: reportsLoading } = useGetReports();

  if (!identity) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Please log in to access the moderator dashboard.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (adminLoading) {
    return (
      <div className="container py-8">
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">You do not have permission to access this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const pendingReports = reports.filter((r) => r.status === ReportStatus.pending);
  const reviewedReports = reports.filter((r) => r.status === ReportStatus.reviewed);
  const resolvedReports = reports.filter((r) => r.status === ReportStatus.resolved);

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Moderator Dashboard</h1>

      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Moderation System</AlertTitle>
        <AlertDescription>
          Warning progression: 3 warnings → 1 strike → ban after next warning. All actions are manual and
          human-moderated.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pendingReports.length})</TabsTrigger>
          <TabsTrigger value="reviewed">Reviewed ({reviewedReports.length})</TabsTrigger>
          <TabsTrigger value="resolved">Resolved ({resolvedReports.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          {reportsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          ) : (
            <ReportList reports={pendingReports} />
          )}
        </TabsContent>

        <TabsContent value="reviewed">
          <ReportList reports={reviewedReports} />
        </TabsContent>

        <TabsContent value="resolved">
          <ReportList reports={resolvedReports} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
