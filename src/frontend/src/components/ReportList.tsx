import { Report } from '../backend';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import ModerationActions from './ModerationActions';

interface ReportListProps {
  reports: Report[];
}

export default function ReportList({ reports }: ReportListProps) {
  if (reports.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No reports in this category.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-4">
      {reports.map((report) => {
        const timestamp = new Date(Number(report.timestamp) / 1000000);
        return (
          <Card key={report.id.toString()}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">Report #{report.id.toString()}</CardTitle>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge>{report.violationType}</Badge>
                    <Badge variant="outline">{report.status}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(timestamp, { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-1">Description</h4>
                <p className="text-sm text-muted-foreground">{report.description}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Reported Content</h4>
                <p className="text-sm text-muted-foreground">
                  {report.reportedContent.__kind__ === 'post' && `Post ID: ${report.reportedContent.post.toString()}`}
                  {report.reportedContent.__kind__ === 'reply' &&
                    `Reply ID: ${report.reportedContent.reply.toString()}`}
                  {report.reportedContent.__kind__ === 'userProfile' &&
                    `User: ${report.reportedContent.userProfile.toString()}`}
                </p>
              </div>
              {report.status === 'pending' && <ModerationActions report={report} />}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
