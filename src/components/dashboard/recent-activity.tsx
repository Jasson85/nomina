import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { recentActivity } from '@/lib/data';

export function RecentActivity() {
  return (
    <div className="space-y-6">
      {recentActivity.map((item) => (
        <div key={item.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={item.avatarUrl} alt="Avatar" data-ai-hint={item.avatarHint} />
            <AvatarFallback>{item.title.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{item.title}</p>
            <p className="text-sm text-muted-foreground">
              {item.description}
            </p>
          </div>
          <div className="ml-auto font-medium text-xs text-muted-foreground">{item.time}</div>
        </div>
      ))}
    </div>
  );
}
